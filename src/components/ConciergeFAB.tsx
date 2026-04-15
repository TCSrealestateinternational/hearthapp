"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function ConciergeFAB() {
  return (
    <button
      aria-label="Contact concierge"
      className="fixed bottom-28 right-6 z-40 md:bottom-8 w-14 h-14 rounded-full bg-tertiary-container text-on-tertiary-container shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
    >
      <MaterialIcon name="support_agent" size={28} />
    </button>
  );
}
