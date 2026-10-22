import type { CSSProperties } from "react";

/** A map of CSS custom properties (`--name`) to values. */
export type CSSVariables = Partial<Record<`--${string}`, string | number | undefined>>;

/**
 * Type-safe way to put CSS custom properties into a `style` object.
 * Undefined values are dropped so they fall back to the stylesheet default.
 */
export function cssVars(vars: CSSVariables, style?: CSSProperties): CSSProperties {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined && value !== "") out[key] = value;
  }
  return { ...(out as CSSProperties), ...style };
}
