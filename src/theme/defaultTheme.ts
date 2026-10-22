import { borders, darkColors, effects, layout, lightColors, motion, opacity, radius, shadows, spacing, typography } from "./tokens";
import type { DeepPartial, Theme } from "./types";

/** The complete default (light) theme. Components work with no provider. */
export const defaultTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  radius,
  borders,
  shadows,
  motion,
  opacity,
  effects,
  layout,
  components: {
    button: { variant: "primary", size: "medium", radius: "md" },
    input: { variant: "outline", size: "medium", radius: "md", width: "300px" },
    tooltip: { delay: 1500, maxWidth: "300px" },
    alert: { duration: 10_000 },
    icon: { size: 20, strokeWidth: 2 },
  },
};

/** Library dark-mode overrides, applied before the consumer's `dark` overrides. */
export const defaultDarkOverrides: DeepPartial<Theme> = {
  colors: darkColors,
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
    md: "0 4px 10px rgba(0, 0, 0, 0.45)",
    lg: "0 12px 32px rgba(0, 0, 0, 0.55)",
    focus: "0 0 0 3px rgba(96, 165, 250, 0.45)",
  },
};
