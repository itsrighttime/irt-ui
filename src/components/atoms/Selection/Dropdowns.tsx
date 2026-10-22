"use client";

import { Dropdown, type DropdownProps } from "./Dropdown";

export type SingleDropdownProps = Omit<DropdownProps, "multiple" | "value" | "setResult"> & {
  value?: string;
  setResult: (value: string) => void;
};

/** Single-select `Dropdown` with a string value. */
export function SingleDropdown({ value, setResult, ...props }: SingleDropdownProps) {
  return <Dropdown {...props} multiple={false} value={value ? [value] : []} setResult={(res) => setResult(res[0] ?? "")} />;
}

export type MultipleDropdownProps = Omit<DropdownProps, "multiple">;

/** Multi-select `Dropdown`. */
export function MultipleDropdown(props: MultipleDropdownProps) {
  return <Dropdown {...props} multiple />;
}
