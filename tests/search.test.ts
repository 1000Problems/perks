// Search predicate tests. Validates the haystack covers the expected
// fields, segment + query interact correctly, and name-match pin
// surfaces matching cards regardless of rank position.

import { describe, expect, it } from "vitest";
import { loadCardDatabase } from "@/lib/data/loader";
import {
  haystackFor,
  makeQueryPredicate,
  nameMatch,
  segmentMatches,
} from "@/lib/data/searchIndex";

const db = loadCardDatabase();

describe("haystackFor", () => {
  it("includes the card name", () => {
    const card = db.cards[0];
    expect(haystackFor(card)).toContain(card.name.toLowerCase());
  });

  it("includes the issuer", () => {
    const card = db.cards[0];
    expect(haystackFor(card)).toContain(card.issuer.toLowerCase());
  });

  it("includes ongoing perk names when present", () => {
    const card = db.cards.find((c) => c.ongoing_perks.length > 0);
    expect(card).toBeDefined();
    if (!card) return;
    const perkName = card.ongoing_perks[0].name.toLowerCase();
    expect(haystackFor(card)).toContain(perkName);
  });
});

describe("makeQueryPredicate", () => {
  it("matches card name as substring (case-insensitive)", () => {
    const card = db.cards[0];
    const firstWord = card.name.split(/\s+/)[0];
    const pred = makeQueryPredicate(firstWord.toUpperCase());
    expect(pred(card)).toBe(true);
  });

  it("matches issuer", () => {
    const card = db.cards.find((c) => c.issuer.length > 2);
    expect(card).toBeDefined();
    if (!card) return;
    const pred = makeQueryPredicate(card.issuer);
    expect(pred(card)).toBe(true);
  });

  it("matches a perk name", () => {
    const card = db.cards.find((c) => c.ongoing_perks.length > 0);
    expect(card).toBeDefined();
    if (!card) return;
    // Match against a distinctive substring of a perk name.
    const perkName = card.ongoing_perks[0].name;
    const distinctive = perkName.split(/\s+/).find((w) => w.length >= 4);
    if (!distinctive) return;
    const pred = makeQueryPredicate(distinctive);
    expect(pred(card)).toBe(true);
  });

  it("empty query is a tautology", () => {
    const pred = makeQueryPredicate("   ");
    expect(pred(db.cards[0])).toBe(true);
  });

  it("returns false for nonsense", () => {
    const pred = makeQueryPredicate("zzzqxqxqxqq");
    expect(pred(db.cards[0])).toBe(false);
  });
});

describe("segmentMatches", () => {
  it("nofee filter accepts fee=0 and fee=null", () => {
    expect(segmentMatches("nofee", 0)).toBe(true);
    expect(segmentMatches("nofee", null)).toBe(true);
    expect(segmentMatches("nofee", 95)).toBe(false);
  });

  it("premium filter accepts fee>=395", () => {
    expect(segmentMatches("premium", 395)).toBe(true);
    expect(segmentMatches("premium", 550)).toBe(true);
    expect(segmentMatches("premium", 95)).toBe(false);
    expect(segmentMatches("premium", 0)).toBe(false);
  });

  it("total accepts everything", () => {
    expect(segmentMatches("total", 0)).toBe(true);
    expect(segmentMatches("total", 550)).toBe(true);
    expect(segmentMatches("total", null)).toBe(true);
  });
});

describe("segment + query interaction", () => {
  it("a fee card excluded under nofee, included under total", () => {
    const feeCard = db.cards.find(
      (c) => (c.annual_fee_usd ?? 0) > 0,
    );
    expect(feeCard).toBeDefined();
    if (!feeCard) return;

    const pred = makeQueryPredicate(feeCard.name);

    const inNofee = segmentMatches("nofee", feeCard.annual_fee_usd) && pred(feeCard);
    const inTotal = segmentMatches("total", feeCard.annual_fee_usd) && pred(feeCard);

    expect(inNofee).toBe(false);
    expect(inTotal).toBe(true);
  });

  it("escape-hatch arithmetic: 0 in segment but >0 globally for a fee card", () => {
    const feeCard = db.cards.find(
      (c) => (c.annual_fee_usd ?? 0) >= 95,
    );
    expect(feeCard).toBeDefined();
    if (!feeCard) return;

    const pred = makeQueryPredicate(feeCard.name);

    const inSegment = db.cards.filter(
      (c) => segmentMatches("nofee", c.annual_fee_usd) && pred(c),
    );
    const inAll = db.cards.filter((c) => pred(c));

    expect(inSegment.length).toBe(0);
    expect(inAll.length).toBeGreaterThan(0);
  });
});

describe("nameMatch", () => {
  it("returns the first row whose card name contains the query", () => {
    const target = db.cards[0];
    const rows = db.cards.map((c) => ({ card: c }));
    // Reverse so the target is at the end — name match should still find it.
    const reversed = [...rows].reverse();
    const hit = nameMatch(reversed, target.name);
    expect(hit?.card.id).toBe(target.id);
  });

  it("returns null when no name contains the query", () => {
    const rows = db.cards.map((c) => ({ card: c }));
    const hit = nameMatch(rows, "zzzqxqxqxqq");
    expect(hit).toBeNull();
  });

  it("name-match pin scenario: a low-ranked card with the query in its name surfaces", () => {
    // Build a synthetic ranked list where target is last; name pin should
    // re-order it to the front via the consumer's slice logic.
    const target = db.cards[0];
    const others = db.cards.slice(1, 6).map((c) => ({ card: c }));
    const rows = [...others, { card: target }];
    const hit = nameMatch(rows, target.name);
    expect(hit?.card.id).toBe(target.id);
    // Consumer slices: pin then rest
    const ordered = hit
      ? [hit, ...rows.filter((r) => r.card.id !== hit.card.id)]
      : rows;
    expect(ordered[0].card.id).toBe(target.id);
  });
});
