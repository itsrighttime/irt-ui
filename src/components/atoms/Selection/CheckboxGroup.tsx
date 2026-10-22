"use client";

import { SelectionBox, type SelectionCustomStyles, type SelectionOption, type SelectionValue } from "./SelectionBox";

export type CheckboxOption = SelectionOption | string;

export interface CheckboxGroupProps {
  /** Options; plain strings are used as both label and value. */
  options?: CheckboxOption[];
  /** Selected values. */
  value?: SelectionValue[];
  /** Receives the new selection array. */
  setResult: (value: SelectionValue[]) => void;
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: SelectionCustomStyles;
  width?: string;
  required?: boolean;
  name?: string;
}

/** Multi-select checkbox group. */
export function CheckboxGroup({ options = [], value = [], setResult, ...props }: CheckboxGroupProps) {
  const normalized = options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
  return (
    <SelectionBox
      {...props}
      options={normalized}
      value={value}
      multiple
      setResult={(next) => setResult(Array.isArray(next) ? next : next === null ? [] : [next])}
    />
  );
}
