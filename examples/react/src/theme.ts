import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";

/** App theme: defined once, every library component follows it. */
export const theme = {
  colors: {
    primary: "#7c3aed",
    secondary: "#475569",
  },
  typography: {
    fontFamily: { base: "Poppins, system-ui, sans-serif" },
  },
  radius: { md: "10px" },
  dark: {
    colors: { primary: "#a78bfa" },
  },
} satisfies ThemeConfig;
