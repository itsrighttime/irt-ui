"use client";

import { useId, type KeyboardEvent } from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import type { SizeToken } from "../../../theme/types";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Button } from "../Button/Button";
import styles from "./Stepper.module.css";

export interface StepperProps {
  /** Current value. Re-syncs when changed by the parent. @default 0 */
  value?: number;
  setResult: (val: number) => void;
  /** @default var(--irt-color-primary) */
  color?: string;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 5 */
  step?: number;
  label?: string;
  /** @default "300px" */
  width?: string;
  required?: boolean;
  disabled?: boolean;
  /** Control size. @default "medium" */
  size?: SizeToken;
  /** Horizontal alignment of the label and control inside `width`. @default "center" */
  align?: "start" | "center";
  /** Format the displayed value (e.g. `(v) => \`${v} kg\``). */
  formatValue?: (value: number) => string;
  /** Helper text under the control. */
  helperText?: string;
  className?: string;
}

/**
 * Numeric value with − / + buttons. The value is a `spinbutton`: focus it and
 * use ↑/↓ (step), PageUp/PageDown (10 × step), Home/End (min/max).
 */
export function Stepper({
  value = 0,
  setResult,
  color = "var(--irt-color-primary)",
  min = 0,
  max = 100,
  step = 5,
  label = "",
  width = "300px",
  required = false,
  disabled = false,
  size = "medium",
  align = "center",
  formatValue,
  helperText,
  className,
}: StepperProps) {
  const [stepperValue, setStepperValue] = useSyncedState(value);
  const labelId = useId();
  const helpId = useId();

  const setTo = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === stepperValue) return;
    setStepperValue(clamped);
    setResult(clamped);
  };

  const change = (delta: number) => {
    const next = stepperValue + delta;
    if (next < min || next > max) return;
    setTo(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const map: Record<string, () => void> = {
      ArrowUp: () => change(step),
      ArrowRight: () => change(step),
      ArrowDown: () => change(-step),
      ArrowLeft: () => change(-step),
      PageUp: () => setTo(stepperValue + step * 10),
      PageDown: () => setTo(stepperValue - step * 10),
      Home: () => setTo(min),
      End: () => setTo(max),
    };
    const action = map[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  const display = formatValue ? formatValue(stepperValue) : String(stepperValue);

  return (
    <div
      className={cx(styles.stepperContainer, styles[size], align === "start" && styles.alignStart, disabled && styles.disabled, className)}
      style={cssVars({ "--irt-c-color": color, "--irt-c-width": width })}
    >
      {(label || required) && (
        <div className={styles.header}>
          {label && (
            <label id={labelId} className={styles.stepperLabel}>
              {label}
            </label>
          )}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}
      <div className={styles.stepperControls} role="group" aria-labelledby={label ? labelId : undefined}>
        <Button
          iconLeft="minus"
          onClick={() => change(-step)}
          color="var(--irt-c-color)"
          size={size}
          radius="none"
          className={styles.stepButton}
          iconOnly
          ariaLabel="Decrease"
          variant="ghost"
          disabled={disabled || stepperValue - step < min}
        />
        <div
          className={styles.stepperOutput}
          role="spinbutton"
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={stepperValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={formatValue ? display : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : "Value"}
          aria-describedby={helperText ? helpId : undefined}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          onKeyDown={onKeyDown}
        >
          {display}
        </div>
        <Button
          iconLeft="plus"
          onClick={() => change(step)}
          color="var(--irt-c-color)"
          size={size}
          radius="none"
          className={styles.stepButton}
          iconOnly
          ariaLabel="Increase"
          variant="ghost"
          disabled={disabled || stepperValue + step > max}
        />
      </div>
      {helperText && (
        <span id={helpId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}
