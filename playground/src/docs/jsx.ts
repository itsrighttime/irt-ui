import type { Control, ControlValues } from "./types";

type Attr = [name: string, value: unknown];

const fmt = ([name, value]: Attr): string | null => {
  if (value === undefined || value === null || value === "") return null;
  if (value === true) return name;
  if (value === false) return `${name}={false}`;
  if (typeof value === "string") return value.startsWith("{") ? `${name}=${value}` : `${name}="${value}"`;
  return `${name}={${JSON.stringify(value)}}`;
};

/**
 * Prints a JSX element. Attributes equal to their control default are
 * skipped so snippets only show what was changed.
 */
export function jsx(tag: string, attrs: Attr[], children?: string, indent = ""): string {
  const parts = attrs.map(fmt).filter((p): p is string => p !== null);
  const open = parts.length > 2 ? `<${tag}\n${parts.map((p) => `${indent}  ${p}`).join("\n")}\n${indent}` : `<${tag}${parts.length ? ` ${parts.join(" ")}` : ""}`;
  if (children === undefined) return `${indent}${open}${parts.length > 2 ? "/>" : " />"}`;
  return `${indent}${open}>\n${children
    .split("\n")
    .map((l) => `${indent}  ${l}`)
    .join("\n")}\n${indent}</${tag}>`;
}

/** Attributes from controls, omitting values that equal the control default. */
export function changed(controls: Control[] | undefined, values: ControlValues, names?: string[]): Attr[] {
  return (controls ?? [])
    .filter((c) => !names || names.includes(c.name))
    .map((c) => [c.name, values[c.name] === c.default ? undefined : values[c.name]] as Attr);
}
