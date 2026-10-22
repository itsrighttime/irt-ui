"use client";

import { forwardRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { isIconNameInput, renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./IconButton.module.css";

/** Visual treatment of an {@link IconButton}. */
export type IconButtonVariant = "ghost" | "soft" | "solid" | "outline" | "plain";

export interface IconButtonProps {
  /** Icon: registry name (`"close"`), any React node, or an image URL (`http…`, `/…`, `data:`). */
  icon: IconLike;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Icon colour. @default var(--irt-color-primary) */
  color?: string;
  /** Inline style for the `<button>`. */
  style?: CSSProperties;
  className?: string;
  /** Size multiplier of the base font size. @default 1 */
  size?: string | number;
  /** Accessible name; also shown as a tooltip. */
  label?: string | null;
  /** Show a border in the icon colour. */
  isBorder?: boolean;
  disabled?: boolean;
  /** Fill the background with the icon colour on hover. */
  hoverBackground?: boolean;
  type?: "button" | "submit" | "reset";
  id?: string;
  /**
   * Visual treatment:
   * - `ghost` (default): transparent, tinted background on hover
   * - `soft`: tinted background at rest
   * - `solid`: filled with `color`, icon in the background colour
   * - `outline`: border in `color` (same as `isBorder`)
   * - `plain`: no background or padding at all (legacy look)
   * @default "ghost" (or "outline" when `isBorder`)
   */
  variant?: IconButtonVariant;
  /** Corner shape. @default "rounded" */
  shape?: "rounded" | "circle" | "square";
  /** Highlight as active/selected (sets `aria-pressed`). */
  active?: boolean;
}

const isImageSource = (value: unknown): value is string =>
  typeof value === "string" && !isIconNameInput(value) && /^(https?:|data:|blob:|\/|\.\/)/.test(value);

/** Square, icon-only button with an optional tooltip label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    onClick,
    color = "var(--irt-color-primary)",
    style,
    className,
    size = 1,
    label = null,
    isBorder = false,
    disabled = false,
    hoverBackground = false,
    type = "button",
    id,
    variant,
    shape = "rounded",
    active,
  },
  ref,
) {
  const vars = cssVars({
    "--irt-c-icon-color": color,
    "--irt-c-icon-size": `calc(var(--irt-font-size-base) * ${size})`,
    "--irt-c-border": isBorder ? `var(--irt-border-width-thin) solid ${color}` : undefined,
  });
  const resolvedVariant: IconButtonVariant = variant ?? (isBorder ? "outline" : "ghost");

  let content: ReactNode;
  if (isImageSource(icon)) {
    content = <img src={icon} className={styles.image} alt={label ?? ""} />;
  } else {
    content = renderIcon(icon, { size: "1em" });
  }

  const button = (
    <button
      ref={ref}
      id={id}
      type={type}
      className={cx(
        styles.btn,
        styles[resolvedVariant],
        styles[shape],
        active && styles.active,
        hoverBackground && styles.hoverBg,
        className,
      )}
      onClick={disabled ? undefined : onClick}
      aria-pressed={active === undefined ? undefined : active}
      style={{ ...vars, ...style }}
      disabled={disabled}
      aria-label={label ?? undefined}
    >
      {content}
    </button>
  );

  return (
    <div
      className={cx(styles.iconButton, disabled && styles.disabled)}
      style={vars}
    >
      {label ? <Tooltip content={label}>{button}</Tooltip> : button}
    </div>
  );
});
