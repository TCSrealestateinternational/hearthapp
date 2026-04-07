import type { BrandTokens } from "@/types";

const CSS_VAR_MAP: Record<keyof BrandTokens, string> = {
  primary: "--color-primary",
  primaryLight: "--color-primary-light",
  secondary: "--color-secondary",
  cta: "--color-cta",
  ctaHover: "--color-cta-hover",
  background: "--color-background",
  surface: "--color-surface",
  textPrimary: "--color-text-primary",
  textSecondary: "--color-text-secondary",
  border: "--color-border",
  success: "--color-success",
  warning: "--color-warning",
  error: "--color-error",
  surfaceContainer: "--color-surface-container",
  surfaceContainerHigh: "--color-surface-container-high",
};

export function applyBrandTokens(tokens: BrandTokens): void {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    const value = tokens[key as keyof BrandTokens];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  }
}

export const defaultTokens: BrandTokens = {
  primary: "#2F5233",
  primaryLight: "#E8F0E9",
  secondary: "#1A3C5E",
  cta: "#C4A35A",
  ctaHover: "#B8933F",
  background: "#FAF9F6",
  surface: "#FFFFFF",
  textPrimary: "#2C2C2C",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  warning: "#EAB308",
  error: "#DC2626",
  surfaceContainer: "#F5F4F1",
  surfaceContainerHigh: "#EEEDEA",
};
