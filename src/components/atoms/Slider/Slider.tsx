"use client";

import { useId, type ChangeEvent } from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Button } from "../Button/Button";
import styles from "./Slider.module.css";

export type SliderValueSide = "none" | "left" | "right" | "top" | "bottom";

export interface SliderProps {
  /** Current value. Re-syncs when changed by the parent. @default 0 */
  value?: number;
  /** Called with every new value (drag and ± buttons). */
  setResult: (val: number) => void;
  color?: string;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  label?: string;
  /** Show min/max labels. @default true */
  showRange?: boolean;
  /** Where to show the current value. @default "none" */
  showValueSide?: SliderValueSide;
  /** Rounding factor: values are rounded to `1 / precision`. @default 10 */
  precision?: number;
  /** @default "300px" */
  width?: string;
  required?: boolean;
  disabled?: boolean;
  /** Show the − / + step buttons. @default true */
  showButtons?: boolean;
  /** Format the displayed value and range labels (e.g. `(v) => \`${v}%\``). */
  formatValue?: (value: number) => string;
  /** Helper text under the slider. */
  helperText?: string;
  className?: string;
  id?: string;
}

const SIDE_CLASS: Record<SliderValueSide, string | undefined> = {
  none: styles.bottom,
  bottom: styles.bottom,
  top: styles.top,
  left: styles.left,
  right: styles.right,
};

/** Range slider with ± step buttons. */
export function Slider({
  value = 0,
  setResult,
  color,
  min = 0,
  max = 100,
  step = 1,
  label = "",
  showRange = true,
  showValueSide = "none",
  precision = 10,
  width = "300px",
  required = false,
  disabled = false,
  showButtons = true,
  formatValue,
  helperText,
  className,
  id,
}: SliderProps) {
  const [sliderValue, setSliderValue] = useSyncedState(value);
  const autoId = useId();
  const inputId = id ?? autoId;
  const format = (val: number) => (formatValue ? formatValue(val) : String(val));

  const round = (val: number) => Math.round(val * precision) / precision;
  const clamp = (val: number) => Math.min(max, Math.max(min, val));

  const commit = (next: number) => {
    const val = clamp(round(next));
    setSliderValue(val);
    setResult(val);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number.parseFloat(event.target.value);
    if (!Number.isNaN(next)) commit(next);
  };

  const accent = color ?? "var(--irt-color-primary)";
  const percentage = max === min ? 0 : ((sliderValue - min) / (max - min)) * 100;

  return (
    <div
      className={cx(styles.sliderContainer, disabled && styles.disabled, className)}
      style={cssVars({ "--irt-c-color": accent, "--irt-c-width": width, "--irt-c-percent": `${percentage}%` })}
    >
      {label && (
        <label htmlFor={inputId} className={styles.sliderLabel}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className={cx(styles.inputOutputContainer, SIDE_CLASS[showValueSide])}>
        <div className={styles.inputContainer}>
          {showButtons && (
            <Button
              iconLeft="minus"
              onClick={() => commit(sliderValue - step)}
              color={color}
              size="small"
              radius="lg"
              className={styles.stepButton}
              iconOnly
              ariaLabel="Decrease"
              variant="ghost"
              disabled={disabled || sliderValue <= min}
            />
          )}
          {showRange && (
            <p className={styles.rangeLabel} aria-hidden="true">
              {format(min)}
            </p>
          )}
          <input
            id={inputId}
            type="range"
            value={sliderValue}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            required={required}
            aria-label={label ? undefined : "Value"}
            aria-valuetext={formatValue ? format(sliderValue) : undefined}
            aria-describedby={helperText ? `${inputId}-help` : undefined}
            className={styles.slider}
          />
          {showRange && (
            <p className={styles.rangeLabel} aria-hidden="true">
              {format(max)}
            </p>
          )}
          {showButtons && (
            <Button
              iconLeft="plus"
              onClick={() => commit(sliderValue + step)}
              color={color}
              size="small"
              radius="lg"
              className={styles.stepButton}
              iconOnly
              ariaLabel="Increase"
              variant="ghost"
              disabled={disabled || sliderValue >= max}
            />
          )}
          {required && !label && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </div>
        {showValueSide !== "none" && (
          <output htmlFor={inputId} className={styles.sliderValue} aria-live="polite">
            {format(sliderValue)}
          </output>
        )}
      </div>
      {helperText && (
        <span id={`${inputId}-help`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
}
