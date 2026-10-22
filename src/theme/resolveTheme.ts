import { defaultDarkOverrides, defaultTheme } from "./defaultTheme";
import type { DeepPartial, Theme, ThemeConfig, ThemeMode } from "./types";

/** Prefix used for every CSS custom property and class emitted by the library. */
export const CSS_VAR_PREFIX = "irt";

type PlainObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Deep merges `overrides` into a copy of `base`. Objects merge recursively;
 * every other value (including arrays) replaces. `undefined` is ignored.
 */
export function deepMerge<T>(base: T, ...overrides: Array<DeepPartial<T> | undefined>): T {
  let result: unknown = base;
  for (const override of overrides) {
    if (override === undefined) continue;
    result = mergeTwo(result, override);
  }
  return result as T;
}

function mergeTwo(base: unknown, override: unknown): unknown {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override;
  }
  const out: PlainObject = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    out[key] = key in base ? mergeTwo(base[key], value) : value;
  }
  return out;
}

export interface ThemeValidationIssue {
  path: string;
  message: string;
}

/**
 * Checks a (possibly JSON-sourced) theme config against the default theme
 * shape: unknown keys and wrongly typed values are reported.
 */
export function validateThemeConfig(config: unknown): ThemeValidationIssue[] {
  const issues: ThemeValidationIssue[] = [];
  if (config === undefined || config === null) return issues;
  if (!isPlainObject(config)) {
    return [{ path: "", message: "Theme config must be an object" }];
  }

  const walk = (value: unknown, reference: unknown, path: string) => {
    if (isPlainObject(reference)) {
      if (!isPlainObject(value)) {
        issues.push({ path, message: "Expected an object" });
        return;
      }
      for (const [key, child] of Object.entries(value)) {
        const childPath = path ? `${path}.${key}` : key;
        if (!(key in reference)) {
          issues.push({ path: childPath, message: "Unknown theme key" });
          continue;
        }
        walk(child, reference[key], childPath);
      }
      return;
    }
    const expected = typeof reference;
    if (typeof value !== expected) {
      issues.push({ path, message: `Expected ${expected}, received ${typeof value}` });
    }
  };

  const { dark, ...rest } = config as PlainObject;
  walk(rest, defaultTheme, "");
  if (dark !== undefined) walk(dark, defaultTheme, "dark");
  return issues;
}

/**
 * Produces the final theme for a mode with precedence:
 * library default → library dark overrides (dark only) → consumer config →
 * consumer `dark` overrides (dark only).
 */
export function resolveTheme(config: ThemeConfig | undefined, mode: ThemeMode = "light"): Theme {
  const { dark, ...light } = config ?? {};
  return mode === "dark"
    ? deepMerge<Theme>(defaultTheme, defaultDarkOverrides, light, dark)
    : deepMerge<Theme>(defaultTheme, light);
}

const kebab = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();

/** Top-level section → CSS variable prefix. `null` means "not emitted". */
const SECTION_PREFIX: Record<keyof Theme, string | null> = {
  colors: "color",
  typography: "",
  spacing: "space",
  radius: "radius",
  borders: "border",
  shadows: "shadow",
  motion: "",
  opacity: "opacity",
  effects: "",
  layout: "",
  components: null,
};

const SEGMENT_ALIAS: Record<string, string> = {
  zIndex: "z",
  baseFontSize: "fontSizeBase",
  breakpoints: "breakpoint",
};

/** Flattens a theme into `{ "--irt-color-primary": "#…" , … }`. */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  const walk = (value: unknown, segments: string[]) => {
    if (isPlainObject(value)) {
      for (const [key, child] of Object.entries(value)) {
        walk(child, [...segments, kebab(SEGMENT_ALIAS[key] ?? key)]);
      }
      return;
    }
    if (typeof value === "string" || typeof value === "number") {
      vars[`--${CSS_VAR_PREFIX}-${segments.filter(Boolean).join("-")}`] = String(value);
    }
  };

  for (const section of Object.keys(SECTION_PREFIX) as Array<keyof Theme>) {
    const prefix = SECTION_PREFIX[section];
    if (prefix === null) continue;
    walk(theme[section], [prefix]);
  }
  return vars;
}

/** Strips characters that could break out of a declaration or `<style>` tag. */
export function sanitizeCssValue(value: string): string {
  return value.replace(/[<>{};]/g, "");
}

/** Serialises CSS variables into a declaration block body. */
export function cssVarsToDeclarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([name, value]) => `${name}:${sanitizeCssValue(value)};`)
    .join("");
}

/**
 * Returns `var(--irt-…)` for a dotted theme path, e.g.
 * `themeVar("colors.primary")` → `"var(--irt-color-primary)"`.
 */
export function themeVar(path: string, fallback?: string): string {
  const [section, ...rest] = path.split(".");
  const prefix = SECTION_PREFIX[section as keyof Theme];
  const head = prefix ?? section ?? "";
  const name = [head, ...rest.map((s) => kebab(SEGMENT_ALIAS[s] ?? s))].filter(Boolean).join("-");
  return fallback ? `var(--${CSS_VAR_PREFIX}-${name}, ${fallback})` : `var(--${CSS_VAR_PREFIX}-${name})`;
}
