"use client";

interface MaterialIconProps {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
}

export function MaterialIcon({
  name,
  size = 24,
  filled = false,
  className = "",
  "aria-hidden": ariaHidden = true,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden={ariaHidden}
    >
      {name}
    </span>
  );
}
