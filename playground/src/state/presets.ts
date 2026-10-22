import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";

export interface ThemePreset {
  id: string;
  name: string;
  config: ThemeConfig;
}

/** Starting points for the theme builder. */
export const presets: ThemePreset[] = [
  { id: "default", name: "Default (teal)", config: {} },
  {
    id: "violet",
    name: "Violet",
    config: {
      colors: { primary: "#7c3aed", primaryHover: "#6d28d9", primaryActive: "#5b21b6", primarySubtle: "#f3e8ff", accent: "#a78bfa" },
      typography: { fontFamily: { base: "Poppins, system-ui, sans-serif", heading: "Poppins, system-ui, sans-serif" } },
      radius: { sm: "6px", md: "10px", lg: "16px" },
      dark: { colors: { primary: "#a78bfa", onPrimary: "#1e1033", primarySubtle: "#2e1a4f" } },
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    config: {
      colors: { primary: "#0369a1", primaryHover: "#075985", primaryActive: "#0c4a6e", primarySubtle: "#e0f2fe", accent: "#38bdf8", text: "#0f172a" },
      typography: { fontFamily: { base: "Inter, system-ui, sans-serif", heading: "Inter, system-ui, sans-serif" } },
      radius: { sm: "2px", md: "4px", lg: "6px" },
      dark: { colors: { primary: "#38bdf8", onPrimary: "#04223a", background: "#020617", surface: "#0b1424", surfaceMuted: "#0f1b30" } },
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    config: {
      colors: { primary: "#c2410c", primaryHover: "#9a3412", primaryActive: "#7c2d12", primarySubtle: "#ffedd5", accent: "#fb923c", secondary: "#78350f" },
      typography: { fontFamily: { base: "Roboto, system-ui, sans-serif", heading: "Lora, Georgia, serif" } },
      radius: { sm: "8px", md: "14px", lg: "22px" },
      dark: { colors: { primary: "#fb923c", onPrimary: "#2a1002" } },
    },
  },
  {
    id: "mono",
    name: "Monochrome",
    config: {
      colors: { primary: "#111827", onPrimary: "#ffffff", primaryHover: "#1f2937", primaryActive: "#374151", primarySubtle: "#f3f4f6", accent: "#6b7280", info: "#374151" },
      typography: { fontFamily: { base: '"JetBrains Mono", ui-monospace, monospace' } },
      radius: { sm: "0", md: "0", lg: "0" },
      dark: { colors: { primary: "#f9fafb", onPrimary: "#111827", primarySubtle: "#1f2937" } },
    },
  },
];
