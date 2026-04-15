"use client";

interface RoleToggleProps {
  activeRole: "buyer" | "seller";
  onToggle: () => void;
}

export function RoleToggle({ activeRole, onToggle }: RoleToggleProps) {
  return (
    <div role="group" aria-label="Select your role" className="inline-flex items-center bg-surface-container-high rounded-full p-1">
      <button
        aria-pressed={activeRole === "buyer"}
        onClick={activeRole !== "buyer" ? onToggle : undefined}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          activeRole === "buyer"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Buying
      </button>
      <button
        aria-pressed={activeRole === "seller"}
        onClick={activeRole !== "seller" ? onToggle : undefined}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          activeRole === "seller"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Selling
      </button>
    </div>
  );
}
