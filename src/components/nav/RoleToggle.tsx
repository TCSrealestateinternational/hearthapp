"use client";

interface RoleToggleProps {
  activeRole: "buyer" | "seller";
  onToggle: () => void;
}

export function RoleToggle({ activeRole, onToggle }: RoleToggleProps) {
  return (
    <div className="inline-flex items-center bg-primary-light rounded-full p-1">
      <button
        onClick={activeRole !== "buyer" ? onToggle : undefined}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          activeRole === "buyer"
            ? "bg-primary text-white"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Buying
      </button>
      <button
        onClick={activeRole !== "seller" ? onToggle : undefined}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          activeRole === "seller"
            ? "bg-primary text-white"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        Selling
      </button>
    </div>
  );
}
