import type { CSSProperties, ReactNode } from "react";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cx } from "../../../utils/cx";
import styles from "./Badge.module.css";

/** Colour role of a {@link Badge}. */
export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

export interface BadgeProps {
  children?: ReactNode;
  /** Colour role. @default "neutral" */
  tone?: BadgeTone;
  /** `soft` (tinted), `solid` (filled) or `outline`. @default "soft" */
  variant?: "soft" | "solid" | "outline";
  /** @default "medium" */
  size?: "small" | "medium";
  /** Leading icon (registry name or node). */
  icon?: IconLike;
  /** Show a status dot before the text. */
  dot?: boolean;
  /** Custom colour (any CSS colour / `var(--irt-…)`); overrides `tone`. */
  color?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

const TONE_COLOR: Record<BadgeTone, string> = {
  neutral: "var(--irt-color-text-muted)",
  primary: "var(--irt-color-primary)",
  success: "var(--irt-color-success)",
  warning: "var(--irt-color-warning)",
  danger: "var(--irt-color-danger)",
  info: "var(--irt-color-info)",
};

/** Small status label / count (server-component safe). */
export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  size = "medium",
  icon,
  dot = false,
  color,
  className,
  style,
  title,
}: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, styles[variant], styles[size], className)}
      style={{ ["--irt-c-badge" as string]: color ?? TONE_COLOR[tone], ...style }}
      title={title}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon(icon, { size: "1em" })}
        </span>
      )}
      {children}
    </span>
  );
}
