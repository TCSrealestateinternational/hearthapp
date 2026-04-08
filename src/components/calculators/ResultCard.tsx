"use client";

interface ResultCardProps {
  label: string;
  value: string;
  variant?: "primary" | "secondary" | "success" | "error";
  detail?: string;
  breakdown?: { label: string; value: string }[];
}

const variantBg: Record<string, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  error: "bg-error text-white",
};

export function ResultCard({
  label,
  value,
  variant = "primary",
  detail,
  breakdown,
}: ResultCardProps) {
  return (
    <div className={`rounded-2xl p-4 sm:p-6 ${variantBg[variant]}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {detail && <p className="text-xs opacity-60 mt-1">{detail}</p>}
      {breakdown && breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
          {breakdown.map((row) => (
            <div key={row.label} className="flex justify-between text-sm opacity-80">
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "font-semibold text-text-primary pt-2 border-t border-border"
          : "text-text-secondary"
      }`}
    >
      <span>{label}</span>
      <span className={bold ? "" : "font-medium"}>{value}</span>
    </div>
  );
}
