"use client";

import { SelectionBox, type SelectionCustomStyles, type SelectionOption, type SelectionValue } from "./SelectionBox";

export type RadioOption = (SelectionOption & { key?: string | number }) | string;

export interface RadioGroupProps {
  /** Options; plain strings are used as both label and value. */
  options: RadioOption[];
  /** Selected value. */
  value?: SelectionValue;
  /** Receives the chosen value. */
  setResult: (value: SelectionValue | null) => void;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: SelectionCustomStyles;
  width?: string;
  required?: boolean;
  name?: string;
}

/** Single-select radio group. */
export function RadioGroup({ options = [], value, setResult, ...props }: RadioGroupProps) {
  const normalized = options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
  return (
    <SelectionBox
      {...props}
      options={normalized}
      value={value !== undefined ? [value] : []}
      multiple={false}
      setResult={(next) => setResult(Array.isArray(next) ? (next[0] ?? null) : next)}
    />
  );
}
