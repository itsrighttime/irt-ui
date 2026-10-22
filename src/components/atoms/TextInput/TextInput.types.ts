import type { InputHTMLAttributes } from "react";
import type { BaseProps, OmitProp } from "../../../types/base-props";
import type { IconLike } from "../../../icons/renderIcon";
import type { InputVariant } from "../../../theme/types";

export type { InputVariant };

export type TextInputType = "text" | "password" | "number" | "email" | "tel" | "url" | "search";

export interface TextInputProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, OmitProp | "type"> {
  /** Floating label (also used as placeholder while empty). */
  label?: string;
  /** Hint shown under the field. */
  helperText?: string;
  /** Error message (marks the field invalid). */
  error?: string;
  /** @default theme `components.input.variant` ("outline") */
  variant?: InputVariant;
  /** Native input type. @default "text" */
  textType?: TextInputType;
  iconLeft?: IconLike;
  iconRight?: IconLike;
  /** Stretch to the container width. */
  block?: boolean;
  /** Called with the new string value on every change. */
  setResult?: (value: string) => void;
}

/** Props for the preset inputs (type is fixed by the preset). */
export type TextInputVariantProps = Omit<TextInputProps, "textType">;

/** @deprecated Misspelled alias of `TextInputVariantProps`. */
export type TextInputVarientType = TextInputVariantProps;
