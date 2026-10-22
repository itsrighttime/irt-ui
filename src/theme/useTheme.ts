"use client";

import { useContext } from "react";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import { canUseDOM } from "../utils/dom";

/** Returns the current theme, mode and mode setter. Works without a provider (defaults). */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * Returns the element floating UI (modals, popovers, tooltips) should portal
 * into so it inherits the nearest scoped theme. `null` during SSR.
 */
export function usePortalContainer(): HTMLElement | null {
  const { portalContainer } = useContext(ThemeContext);
  if (portalContainer) return portalContainer;
  return canUseDOM ? document.body : null;
}
