import type { ThemeEffects, ThemeMotion, ThemeOpacity, ThemeShadows } from "../types";

export const shadows: ThemeShadows = {
  none: "none",
  sm: "0 1px 2px rgba(16, 24, 40, 0.06)",
  md: "0 4px 10px rgba(16, 24, 40, 0.10)",
  lg: "0 12px 32px rgba(16, 24, 40, 0.18)",
  focus: "0 0 0 3px rgba(37, 99, 235, 0.35)",
};

export const motion: ThemeMotion = {
  duration: { fast: "120ms", normal: "200ms", slow: "400ms" },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.3, 0, 0, 1.3)",
    linear: "linear",
  },
};

export const opacity: ThemeOpacity = {
  disabled: "0.6",
  muted: "0.75",
  overlay: "0.5",
};

export const effects: ThemeEffects = {
  backdropBlur: "blur(4px)",
};
