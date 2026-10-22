import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
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
  /** Text colour. @default var(--irt-color-primary) (was `accent` before 0.2 — low contrast on light backgrounds) */
  color?: string;
  /** Font size in rem. @default 1 */
  fontSize?: number;
  /** @default 400 */
  fontWeight?: number;
  /** Underlined at rest (and not on hover) instead of the reverse. */
  isUnderline?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  /** Icon before the label (registry name or node). */
  iconLeft?: IconLike;
  /** Icon after the label (registry name or node). */
  iconRight?: IconLike;
  /** Accessible name when the visible text is not descriptive. */
  ariaLabel?: string;
  id?: string;
}

/** Text-only, link-style button. */
export function PlainButton({
  onClick,
  style,
  className,
  text = "Click Me",
  children,
  color = "var(--irt-color-primary)",
  fontSize = 1,
  fontWeight = 400,
  isUnderline = false,
  disabled = false,
  type = "button",
  iconLeft,
  iconRight,
  ariaLabel,
  id,
}: PlainButtonProps) {
  return (
    <button
      type={type}
      id={id}
      aria-label={ariaLabel}
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
      {iconLeft != null && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon(iconLeft, { size: "1em" })}
        </span>
      )}
      <span className={styles.text}>{children ?? text}</span>
      {iconRight != null && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon(iconRight, { size: "1em" })}
        </span>
      )}
    </button>
  );
}
