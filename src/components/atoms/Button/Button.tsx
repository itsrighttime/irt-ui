"use client";

import { forwardRef, type ElementType, type ForwardedRef, type MouseEvent } from "react";
import { renderIcon } from "../../../icons/renderIcon";
import { useTheme } from "../../../theme/useTheme";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./Button.module.css";
import type { ButtonComponent, ButtonProps } from "./Button.types";

export type { ButtonProps, ButtonOwnProps, ButtonComponent, ButtonVariant, PolymorphicProps, PolymorphicRef } from "./Button.types";

const ICON_SIZE = {
  small: "var(--irt-font-size-sm)",
  medium: "var(--irt-font-size-md)",
  large: "var(--irt-font-size-lg)",
} as const;

function ButtonInner<C extends ElementType = "button">(
  {
    as,
    children,
    variant,
    size,
    radius,
    iconLeft,
    iconRight,
    iconOnly,
    block,
    loading,
    disabled,
    className,
    style,
    id,
    color,
    width,
    height,
    tooltip,
    ariaLabel,
    responsive,
    onClick,
    ...rest
  }: ButtonProps<C>,
  ref: ForwardedRef<Element>,
) {
  const { theme } = useTheme();
  const defaults = theme.components.button;
  const resolvedVariant = variant ?? defaults.variant;
  const resolvedSize = size ?? defaults.size;
  const resolvedRadius = radius ?? defaults.radius;

  const Component: ElementType = as ?? "button";
  const isNativeButton = Component === "button";
  const isDisabled = Boolean(disabled || loading);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    (onClick as ((e: MouseEvent<HTMLElement>) => void) | undefined)?.(event);
  };

  const element = (
    <Component
      ref={ref}
      id={id}
      type={isNativeButton ? ((rest as { type?: string }).type ?? "button") : undefined}
      {...rest}
      style={cssVars(
        {
          "--irt-c-icon-size": ICON_SIZE[resolvedSize],
          "--irt-c-button-color": color,
          "--irt-c-width": width,
          "--irt-c-height": height,
        },
        style,
      )}
      aria-label={ariaLabel ?? (iconOnly && typeof tooltip === "string" ? tooltip : undefined)}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      data-responsive={responsive || undefined}
      className={cx(
        styles.button,
        styles[resolvedVariant],
        styles[resolvedSize],
        styles[`radius-${resolvedRadius}`],
        block && styles.block,
        iconOnly && styles.iconOnly,
        isDisabled && styles.disabled,
        loading && styles.loading,
        className,
      )}
      disabled={isNativeButton ? isDisabled : undefined}
      tabIndex={!isNativeButton && isDisabled ? -1 : (rest as { tabIndex?: number }).tabIndex}
      onClick={handleClick}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && iconLeft != null && (
        <span className={styles.icon} aria-hidden={iconOnly ? undefined : true}>
          {renderIcon(iconLeft, { size: "1em" })}
        </span>
      )}
      {!iconOnly && children != null && <span className={styles.label}>{children}</span>}
      {!loading && iconRight != null && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon(iconRight, { size: "1em" })}
        </span>
      )}
    </Component>
  );

  return tooltip ? (
    <Tooltip content={tooltip} delay={0}>
      {element}
    </Tooltip>
  ) : (
    element
  );
}

/**
 * Polymorphic button with variants, sizes, icons, loading state and tooltip.
 * Use `as` to render a link or router component.
 */
export const Button = forwardRef(ButtonInner) as unknown as ButtonComponent;
Button.displayName = "Button";
