import { createContext } from "react";
import { defaultTheme } from "./defaultTheme";
import type { Theme, ThemeMode, ThemeModePreference } from "./types";

export interface ThemeContextValue {
  /** Fully resolved theme for the current mode. */
  theme: Theme;
  /** Mode preference (`"system"` follows the OS). */
  mode: ThemeModePreference;
  /** Mode actually applied (`"system"` resolved; `"light"` during SSR). */
  resolvedMode: ThemeMode;
  /** Changes the mode preference (no-op without a provider). */
  setMode: (mode: ThemeModePreference) => void;
  /** Element portals should render into to stay inside this theme scope. */
  portalContainer: HTMLElement | null;
  /** `true` when a ThemeProvider is present above. */
  hasProvider: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  mode: "light",
  resolvedMode: "light",
  setMode: () => undefined,
  portalContainer: null,
  hasProvider: false,
});
ThemeContext.displayName = "IrtThemeContext";
