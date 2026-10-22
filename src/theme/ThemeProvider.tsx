"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import {
  CSS_VAR_PREFIX,
  cssVarsToDeclarations,
  resolveTheme,
  themeToCssVars,
  validateThemeConfig,
} from "./resolveTheme";
import type { ThemeConfig, ThemeMode, ThemeModePreference } from "./types";

export interface ThemeProviderProps {
  /** Theme overrides (TypeScript object or parsed JSON). Deep-merged over the default theme. */
  theme?: ThemeConfig;
  /** Controlled mode preference. */
  mode?: ThemeModePreference;
  /** Initial mode preference when uncontrolled. @default "light" */
  defaultMode?: ThemeModePreference;
  /** Called when `setMode` is invoked from `useTheme()`. */
  onModeChange?: (mode: ThemeModePreference) => void;
  /**
   * `"global"` writes variables to `:root` (portals anywhere inherit them);
   * `"local"` scopes them to this subtree. Defaults to `"global"` for the
   * outermost provider and `"local"` for nested providers.
   */
  scope?: "global" | "local";
  /** Report invalid theme keys/values with `console.warn`. @default true outside production */
  validate?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const isProduction =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.NODE_ENV === "production";

const darkQuery = "(prefers-color-scheme: dark)";

function useSystemMode(enabled: boolean): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("light");
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia(darkQuery);
    const update = () => setMode(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [enabled]);
  return mode;
}

function diffVars(base: Record<string, string>, next: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(next)) {
    if (base[key] !== value) out[key] = value;
  }
  return out;
}

/**
 * Provides the design tokens as `--irt-*` CSS custom properties and exposes the
 * resolved theme through `useTheme()`. CSS is rendered into a `<style>` tag, so
 * the correct values (including `"system"` dark mode via media query) are
 * present in server-rendered HTML — no flash, no hydration mismatch.
 */
export function ThemeProvider({
  theme: config,
  mode: modeProp,
  defaultMode = "light",
  onModeChange,
  scope,
  validate = !isProduction,
  className,
  style,
  children,
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const resolvedScope = scope ?? (parent.hasProvider ? "local" : "global");
  const reactId = useId();
  const scopeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  const [internalMode, setInternalMode] = useState<ThemeModePreference>(defaultMode);
  const mode = modeProp ?? internalMode;
  const systemMode = useSystemMode(mode === "system");
  const resolvedMode: ThemeMode = mode === "system" ? systemMode : mode;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!validate) return;
    for (const issue of validateThemeConfig(config)) {
      console.warn(`[irt-ui] theme${issue.path ? `.${issue.path}` : ""}: ${issue.message}`);
    }
  }, [config, validate]);

  const lightTheme = useMemo(() => resolveTheme(config, "light"), [config]);
  const darkTheme = useMemo(() => resolveTheme(config, "dark"), [config]);

  const css = useMemo(() => {
    const selector =
      resolvedScope === "global" ? ":root" : `[data-${CSS_VAR_PREFIX}-theme="${scopeId}"]`;
    const lightVars = themeToCssVars(lightTheme);
    const darkVars = themeToCssVars(darkTheme);
    if (mode === "dark") {
      return `${selector}{${cssVarsToDeclarations(darkVars)}color-scheme:dark;}`;
    }
    if (mode === "light") {
      return `${selector}{${cssVarsToDeclarations(lightVars)}color-scheme:light;}`;
    }
    return (
      `${selector}{${cssVarsToDeclarations(lightVars)}color-scheme:light;}` +
      `@media ${darkQuery}{${selector}{${cssVarsToDeclarations(diffVars(lightVars, darkVars))}color-scheme:dark;}}`
    );
  }, [darkTheme, lightTheme, mode, resolvedScope, scopeId]);

  const setMode = useCallback(
    (next: ThemeModePreference) => {
      if (modeProp === undefined) setInternalMode(next);
      onModeChange?.(next);
    },
    [modeProp, onModeChange],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: resolvedMode === "dark" ? darkTheme : lightTheme,
      mode,
      resolvedMode,
      setMode,
      portalContainer: resolvedScope === "local" ? container : null,
      hasProvider: true,
    }),
    [container, darkTheme, lightTheme, mode, resolvedMode, resolvedScope, setMode],
  );

  const attrs = {
    [`data-${CSS_VAR_PREFIX}-theme`]: scopeId,
    [`data-${CSS_VAR_PREFIX}-provider-mode`]: mode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        ref={setContainer}
        {...attrs}
        className={className}
        style={{
          display: "contents",
          color: `var(--${CSS_VAR_PREFIX}-color-text)`,
          fontFamily: `var(--${CSS_VAR_PREFIX}-font-family-base)`,
          ...style,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
