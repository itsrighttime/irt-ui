import type { CSSProperties } from "react";

/** A map of CSS custom properties (`--name`) to values. */
export type CSSVariables = Partial<Record<`--${string}`, string | number | undefined>>;

/** Prefix of component-local variables (`--irt-c-*`). */
const LOCAL_PREFIX = "--irt-c-";

/**
 * Type-safe way to put CSS custom properties into a `style` object.
 *
 * - Theme variables (`--irt-*`) with an undefined/empty value are dropped.
 * - Component-local variables (`--irt-c-*`) with an undefined/empty value are
 *   reset to `initial`, so a component never inherits a local variable that an
 *   ancestor component set (e.g. a `width` on a TextInput leaking into the
 *   Button inside it). The stylesheet fallback (`var(--irt-c-x, fallback)`)
 *   then applies.
 */
export function cssVars(vars: CSSVariables, style?: CSSProperties): CSSProperties {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined && value !== "") out[key] = value;
    else if (key.startsWith(LOCAL_PREFIX)) out[key] = "initial";
  }
  return { ...(out as CSSProperties), ...style };
}
