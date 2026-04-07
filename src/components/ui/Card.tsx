"use client";

import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "container" | "container-high" | "elevated" | "glass";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: boolean;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface border border-border shadow-sm",
  container: "bg-surface-container border border-border shadow-sm",
  "container-high": "bg-surface-container-high border border-border shadow-sm",
  elevated: "bg-surface border border-border shadow-md",
  glass:
    "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)] shadow-sm",
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
    <h3 className={`text-lg font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  );
}
