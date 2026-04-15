"use client";

import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "container" | "container-high" | "elevated" | "glass";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: boolean;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface-container-low",
  container: "bg-surface-container",
  "container-high": "bg-surface-container-high",
  elevated: "bg-surface-container-low shadow-md",
  glass:
    "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] shadow-sm",
};

export function Card({
  children,
  padding = true,
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${
        padding ? "p-4 sm:p-6" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold text-on-surface font-serif ${className}`}>
      {children}
    </h3>
  );
}
