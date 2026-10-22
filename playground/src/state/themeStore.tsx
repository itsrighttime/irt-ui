import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, deepMerge, type ThemeConfig, type ThemeModePreference } from "@itsrighttime/irt-ui/theme";
import { IconProvider } from "@itsrighttime/irt-ui/icons";

const STORAGE_KEY = "irt-ui-playground-theme";

interface StoredState {
  config: ThemeConfig;
  mode: ThemeModePreference;
}

export interface PlaygroundTheme extends StoredState {
  setConfig: (config: ThemeConfig) => void;
  /** Deep-merges a patch into the light theme or the dark overrides. */
  patch: (patch: ThemeConfig, target?: "light" | "dark") => void;
  setMode: (mode: ThemeModePreference) => void;
  reset: () => void;
}

const Ctx = createContext<PlaygroundTheme | null>(null);

const load = (): StoredState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    /* storage unavailable */
  }
  return { config: {}, mode: "light" };
};

/** Holds the theme being edited and feeds it into the library ThemeProvider. */
export function PlaygroundThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const setConfig = useCallback((config: ThemeConfig) => setState((s) => ({ ...s, config })), []);
  const setMode = useCallback((mode: ThemeModePreference) => setState((s) => ({ ...s, mode })), []);
  const reset = useCallback(() => setState((s) => ({ ...s, config: {} })), []);
  const patch = useCallback((p: ThemeConfig, target: "light" | "dark" = "light") => {
    setState((s) => {
      if (target === "dark") {
        return { ...s, config: { ...s.config, dark: deepMerge<ThemeConfig>(s.config.dark ?? {}, p) } };
      }
      return { ...s, config: deepMerge<ThemeConfig>(s.config, p) };
    });
  }, []);

  const value = useMemo<PlaygroundTheme>(
    () => ({ ...state, setConfig, setMode, reset, patch }),
    [state, setConfig, setMode, reset, patch],
  );

  return (
    <Ctx.Provider value={value}>
      <ThemeProvider theme={state.config} mode={state.mode} onModeChange={setMode}>
        <IconProvider>{children}</IconProvider>
      </ThemeProvider>
    </Ctx.Provider>
  );
}

export function usePlaygroundTheme(): PlaygroundTheme {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlaygroundTheme must be used inside PlaygroundThemeProvider");
  return ctx;
}

/** Removes empty objects so exported configs stay minimal. */
export function pruneConfig(value: unknown): unknown {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    const pruned = pruneConfig(v);
    if (pruned === undefined) continue;
    if (typeof pruned === "object" && pruned !== null && Object.keys(pruned).length === 0) continue;
    out[k] = pruned;
  }
  return out;
}
