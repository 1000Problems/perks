// Hand-curated background + accent for synthetic card art per issuer.
// Slugs match the issuers table primary key (slugify("Bank of America") =
// "bank_of_america", etc.). Add new issuers as the catalog grows.

export interface IssuerPalette {
  background: string;
  accent: string;
  text?: string;
}

export const ISSUER_PALETTES: Record<string, IssuerPalette> = {
  chase:                 { background: "#0F2A6E", accent: "#1F4FBE" },
  amex:                  { background: "#1A2A3A", accent: "#9DB1C6" },
  citi:                  { background: "#363A40", accent: "#1B7AC0" },
  capital_one:           { background: "#003F75", accent: "#D03027" },
  bank_of_america:       { background: "#7E1F23", accent: "#01304D" },
  wells_fargo:           { background: "#B11424", accent: "#FFCC02" },
  us_bank:               { background: "#0E2D62", accent: "#C8102E" },
  bilt:                  { background: "#0E0E10", accent: "#E8E6DA" },
  synchrony:             { background: "#3F1F77", accent: "#F58220" },
  comenity:              { background: "#272A30", accent: "#9CA3AF" },
  nfcu:                  { background: "#003478", accent: "#E2231A" },
  usaa:                  { background: "#003366", accent: "#A2BBD4" },
  penfed:                { background: "#0B3D91", accent: "#9CB1D8" },
  alliant:               { background: "#0B5394", accent: "#FFB300" },
  apple:                 { background: "#1F2122", accent: "#E5E5E7" },
  discover:              { background: "#F26B25", accent: "#1F1F1F" },
};

const FALLBACK: IssuerPalette = { background: "#2B2D42", accent: "#8D99AE" };

export function paletteFor(issuerSlug: string): IssuerPalette {
  return ISSUER_PALETTES[issuerSlug] ?? FALLBACK;
}
