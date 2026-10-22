import type { ReactNode } from "react";

export type ControlValue = string | number | boolean;

export type Control =
  | { type: "boolean"; name: string; label?: string; default: boolean }
  | { type: "text"; name: string; label?: string; default: string }
  | { type: "number"; name: string; label?: string; default: number; min?: number; max?: number; step?: number }
  | { type: "select"; name: string; label?: string; default: string; options: readonly string[] }
  | { type: "color"; name: string; label?: string; default: string };

export type ControlValues = Record<string, ControlValue>;

export interface PropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface DocEntry {
  id: string;
  title: string;
  group: string;
  description: string;
  /** Import statement shown on the page. */
  imports: string;
  controls?: Control[];
  props?: PropDoc[];
  /** Live preview. */
  render: (values: ControlValues) => ReactNode;
  /** Usage snippet reflecting the current controls. */
  code: (values: ControlValues) => string;
  /** Extra notes rendered under the preview. */
  notes?: ReactNode;
}
