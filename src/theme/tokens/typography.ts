import type { ThemeTypography } from "../types";

export const typography: ThemeTypography = {
  fontFamily: {
    base: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  baseFontSize: "1rem",
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "2rem",
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.2",
    normal: "1.5",
    relaxed: "1.75",
  },
  letterSpacing: {
    tight: "-0.01em",
    normal: "0",
    wide: "0.04em",
  },
  heading: {
    h1: { fontSize: "2rem", fontWeight: "700", lineHeight: "1.2" },
    h2: { fontSize: "1.5rem", fontWeight: "700", lineHeight: "1.25" },
    h3: { fontSize: "1.25rem", fontWeight: "600", lineHeight: "1.3" },
  },
};
