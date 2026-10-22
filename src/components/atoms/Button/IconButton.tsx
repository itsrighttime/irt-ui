"use client";

import { forwardRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { isIconNameInput, renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./IconButton.module.css";

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
  },
  ref,
) {
  const vars = cssVars({
    "--irt-c-icon-color": color,
    "--irt-c-icon-size": `calc(var(--irt-font-size-base) * ${size})`,
    "--irt-c-border": isBorder ? `var(--irt-border-width-thin) solid ${color}` : "none",
  });

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
      className={cx(styles.btn, hoverBackground && styles.hoverBg, className)}
      onClick={disabled ? undefined : onClick}
      style={{ ...vars, ...style }}
      disabled={disabled}
      aria-label={label ?? undefined}
    >
      {content}
    </button>
  );

  return (
    <div className={styles.iconButton} style={{ ...vars, opacity: disabled ? "var(--irt-opacity-disabled)" : 1 }}>
      {label ? <Tooltip content={label}>{button}</Tooltip> : button}
    </div>
  );
});
