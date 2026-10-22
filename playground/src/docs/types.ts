import type { ReactNode } from "react";

export type ControlValue = string | number | boolean;

interface ControlBase {
  name: string;
  /** Label in the controls panel. @default name */
  label?: string;
  /** Section in the controls panel (e.g. "Content", "Appearance", "State"). @default "Props" */
  group?: string;
  /** One-line hint under the control. */
  hint?: string;
  /**
   * The component's real default, when it differs from the demo's starting
   * value. Usage snippets omit a prop only when it equals this (`null` = the
   * component has no default, so the prop is always shown).
   */
  libDefault?: ControlValue | null;
}

export type Control =
  | (ControlBase & { type: "boolean"; default: boolean })
  | (ControlBase & { type: "text"; default: string; placeholder?: string; multiline?: boolean })
  | (ControlBase & { type: "number"; default: number; min?: number; max?: number; step?: number })
  | (ControlBase & { type: "select"; default: string; options: readonly string[] })
  | (ControlBase & { type: "color"; default: string });

export type ControlValues = Record<string, ControlValue>;

/** Hand-written prop notes (the full table is generated from the TypeScript types). */
export interface PropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
}

/** A static, labelled example shown in the "Examples" gallery. */
export interface DocExample {
  title: string;
  description?: string;
  render: () => ReactNode;
  code: string;
}

export interface DocEntry {
  id: string;
  title: string;
  group: string;
  description: string;
  /** Import statement shown on the page. */
  imports: string;
  /** Exported component names whose generated prop tables are shown. @default [title] */
  components?: string[];
  controls?: Control[];
  /** Extra hand-written prop notes (shown above the generated table). */
  props?: PropDoc[];
  /** Live preview. Call `useLog()` inside demos to report callbacks in the Events tab. */
  render: (values: ControlValues) => ReactNode;
  /** Usage snippet reflecting the current controls. */
  code: (values: ControlValues) => string;
  /** Static variant gallery. */
  examples?: DocExample[];
  /** Extra notes rendered under the preview. */
  notes?: ReactNode;
  /** Preview canvas alignment. @default "center" */
  align?: "center" | "start" | "stretch";
}
