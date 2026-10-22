"use client";

import { forwardRef, useId, useState, type ChangeEvent } from "react";
import { renderIcon } from "../../../icons/renderIcon";
import { useTheme } from "../../../theme/useTheme";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Button } from "../Button/Button";
import styles from "./TextInput.module.css";
import type { TextInputProps } from "./TextInput.types";

export type { TextInputProps, TextInputType, TextInputVariantProps, TextInputVarientType, InputVariant } from "./TextInput.types";

/** Text field with floating label, icons, helper/error text and password toggle. */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    helperText,
    error,
    iconLeft,
    iconRight,
    variant,
    size,
    width,
    height,
    radius,
    block,
    loading,
    disabled,
    className,
    style,
    id,
    color,
    tooltip,
    ariaLabel,
    responsive,
    textType = "text",
    setResult,
    label,
    placeholder,
    value,
    onChange,
    ...rest
  },
  ref,
) {
  const { theme } = useTheme();
  const defaults = theme.components.input;
  const resolvedSize = size ?? defaults.size;
  const resolvedVariant = variant ?? defaults.variant;
  const resolvedRadius = radius ?? defaults.radius;

  const autoId = useId();
  const inputId = id ?? autoId;
  const helperId = `${inputId}-help`;

  const [showPassword, setShowPassword] = useState(false);
  const isDisabled = Boolean(disabled || loading);
  const displayLabel = label ? (rest.required ? `${label} *` : label) : undefined;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    onChange?.(event);
    setResult?.(event.target.value);
  };

  const isPassword = textType === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : textType;
  const message = error || helperText;

  return (
    <div
      className={cx(styles.wrapper, block && styles.block, className)}
      style={cssVars(
        {
          "--irt-c-width": width ?? defaults.width,
          "--irt-c-height": height ?? theme.layout.control.height[resolvedSize],
        },
        style,
      )}
      data-responsive={responsive || undefined}
    >
      {displayLabel && hasValue && (
        <label htmlFor={inputId} className={styles.label}>
          {displayLabel}
        </label>
      )}
      <div
        className={cx(
          styles.inputContainer,
          styles[resolvedVariant],
          styles[resolvedSize],
          styles[`radius-${resolvedRadius}`],
          error && styles.error,
          isDisabled && styles.disabled,
        )}
        style={color ? cssVars({ "--irt-c-input-color": color }) : undefined}
      >
        {iconLeft != null && (
          <span className={styles.icon} aria-hidden="true">
            {renderIcon(iconLeft, { size: "1.1em" })}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          type={inputType}
          disabled={isDisabled}
          aria-label={ariaLabel ?? (hasValue ? undefined : label)}
          aria-invalid={error ? true : undefined}
          aria-busy={loading || undefined}
          aria-describedby={message ? helperId : undefined}
          title={tooltip}
          placeholder={displayLabel ?? placeholder}
          value={value}
          {...rest}
          onChange={handleChange}
        />

        {loading && <span className={styles.spinner} aria-hidden="true" />}

        {!loading && isPassword ? (
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowPassword((prev) => !prev)}
            iconOnly
            iconLeft={showPassword ? "eyeOff" : "eye"}
            ariaLabel={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          />
        ) : (
          !loading &&
          iconRight != null && (
            <span className={styles.icon} aria-hidden="true">
              {renderIcon(iconRight, { size: "1.1em" })}
            </span>
          )
        )}
      </div>

      {message && (
        <span id={helperId} className={cx(styles.helperText, error && styles.errorText)} role={error ? "alert" : undefined}>
          {message}
        </span>
      )}
    </div>
  );
});
