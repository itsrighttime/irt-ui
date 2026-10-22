import type { CSSProperties } from "react";

/** Size scale shared by form controls and buttons. */
export type ComponentSize = "small" | "medium" | "large";

/** Corner radius scale (maps to `--irt-radius-*` tokens). */
export type ComponentRadius = "none" | "sm" | "md" | "lg";

/**
 * Props shared by most interactive atoms.
 *
 * Re-created from the original host-app `@/types` contract so that existing
 * call sites (`size`, `radius`, `color`, `width`, `tooltip`, …) keep working.
 */
export interface BaseProps {
  /** Element id. */
  id?: string;
  /** Extra class name merged onto the root element. */
  className?: string;
  /** Inline style overrides (highest precedence). */
  style?: CSSProperties;
  /** Visual size. @default "medium" */
  size?: ComponentSize;
  /** Corner radius. @default "md" */
  radius?: ComponentRadius;
  /** Accent colour override (any CSS colour or `var(--irt-…)`). */
  color?: string;
  /** CSS width of the root element. */
  width?: string;
  /** CSS height of the control. */
  height?: string;
  /** Disables interaction. */
  disabled?: boolean;
  /** Shows a busy indicator and disables interaction. */
  loading?: boolean;
  /** Tooltip content shown on hover/focus. */
  tooltip?: string;
  /** Accessible label when no visible label is present. */
  ariaLabel?: string;
  /** Enables responsive (container-width aware) styling. */
  responsive?: boolean;
}

/**
 * Keys of `BaseProps` that clash with native DOM attributes and must be
 * omitted when extending `*HTMLAttributes`.
 */
export type OmitProp = keyof BaseProps;
