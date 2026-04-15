"use client";

import type { Brokerage } from "@/types";

interface FooterProps {
  brokerage: Brokerage | null;
}

export function Footer({ brokerage }: FooterProps) {
  return (
    <footer className="py-4 px-4 text-center text-xs text-text-secondary border-t border-border bg-surface-container">
      <div className="max-w-7xl mx-auto">
      {brokerage ? (
        <>
          <p className="font-medium">{brokerage.name}</p>
          <p>
            {brokerage.agentName} - {brokerage.agentTitle}
          </p>
          {brokerage.licenseNumber && (
            <p>License #{brokerage.licenseNumber}</p>
          )}
        </>
      ) : (
        <p>Powered by Hearth Real Estate&copy;</p>
      )}
      </div>
    </footer>
  );
}
