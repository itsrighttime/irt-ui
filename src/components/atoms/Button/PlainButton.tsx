import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import styles from "./PlainButton.module.css";

export interface PlainButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  className?: string;
  /** Label (kept for backwards compatibility; `children` takes precedence). */
  text?: string;
  children?: ReactNode;
  /** Text colour. @default var(--irt-color-accent) */
  color?: string;
  /** Font size in rem. @default 1 */
  fontSize?: number;
  /** @default 400 */
  fontWeight?: number;
  /** Underlined at rest (and not on hover) instead of the reverse. */
  isUnderline?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

/** Text-only, link-style button. */
export function PlainButton({
  onClick,
  style,
  className,
  text = "Click Me",
  children,
  color = "var(--irt-color-accent)",
  fontSize = 1,
  fontWeight = 400,
  isUnderline = false,
  disabled = false,
  type = "button",
}: PlainButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.btn, className)}
      onClick={onClick}
      disabled={disabled}
      style={cssVars(
        {
          "--irt-c-color": color,
          "--irt-c-font-size": `${fontSize}rem`,
          "--irt-c-font-weight": fontWeight,
          "--irt-c-underline": isUnderline ? "underline" : "none",
          "--irt-c-underline-hover": isUnderline ? "none" : "underline",
        },
        style,
      )}
    >
      {children ?? text}
    </button>
  );
}
