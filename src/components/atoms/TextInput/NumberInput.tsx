"use client";

import { forwardRef } from "react";
import { TextInput } from "./TextInput";
import type { TextInputVariantProps } from "./TextInput.types";

export type NumberInputProps = TextInputVariantProps;

/** Numeric preset of `TextInput` (value is still emitted as a string). */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(props, ref) {
  return <TextInput ref={ref} inputMode="decimal" {...props} textType="number" />;
});
