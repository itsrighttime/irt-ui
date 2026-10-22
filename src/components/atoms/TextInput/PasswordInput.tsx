"use client";

import { forwardRef } from "react";
import { TextInput } from "./TextInput";
import type { TextInputVariantProps } from "./TextInput.types";

export type PasswordInputProps = TextInputVariantProps;

/** Password preset of `TextInput` with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
  return <TextInput ref={ref} autoComplete="current-password" {...props} textType="password" />;
});
