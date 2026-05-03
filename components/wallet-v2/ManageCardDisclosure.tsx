"use client";

// Collapsed "Manage card" disclosure at the bottom of the hero page.
// Wraps the existing SignalsEditor — so opening date, AU count, status,
// nickname, etc. still live somewhere, just no longer dominate the
// page. Pure admin disclosure; closed by default.

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ManageCardDisclosure({ children }: Props) {
  return (
    <details className="manage-card-disclosure">
      <summary>
        <span className="eyebrow">Manage card</span>
        <span className="manage-card-title">
          Opening date, authorized users, status, remove from wallet
        </span>
        <span className="caret" aria-hidden>
          ›
        </span>
      </summary>
      <div className="manage-card-body">{children}</div>
    </details>
  );
}
