"use client";

import { forwardRef } from "react";
import { TextInput } from "./TextInput";
import type { TextInputVariantProps } from "./TextInput.types";

export type EmailInputProps = TextInputVariantProps;
/** @deprecated Use `EmailInputProps`. */
export type EmailInputType = EmailInputProps;

/** Email preset of `TextInput`. */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(function EmailInput(props, ref) {
  return <TextInput ref={ref} inputMode="email" autoComplete="email" iconLeft="mail" {...props} textType="email" />;
});
