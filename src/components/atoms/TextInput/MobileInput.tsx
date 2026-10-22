"use client";

import { forwardRef } from "react";
import { TextInput } from "./TextInput";
import type { TextInputVariantProps } from "./TextInput.types";

export type MobileInputProps = TextInputVariantProps;

/** Phone preset of `TextInput`; strips everything except digits and `+`. */
export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(function MobileInput(
  { setResult, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      inputMode="tel"
      autoComplete="tel"
      iconLeft="phone"
      {...props}
      textType="tel"
      setResult={(value) => setResult?.(value.replace(/[^\d+]/g, ""))}
    />
  );
});
