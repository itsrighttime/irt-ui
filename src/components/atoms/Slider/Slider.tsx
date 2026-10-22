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
}: SliderProps) {
  const [sliderValue, setSliderValue] = useSyncedState(value);
  const inputId = useId();

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
    <div className={styles.sliderContainer} style={cssVars({ "--irt-c-color": accent, "--irt-c-width": width })}>
      {label && (
        <label htmlFor={inputId} className={styles.sliderLabel}>
          {label}
        </label>
      )}
      <div className={cx(styles.inputOutputContainer, SIDE_CLASS[showValueSide])}>
        <div className={styles.inputContainer}>
          <Button
            iconLeft="minus"
            onClick={() => commit(sliderValue - step)}
            color={color}
            style={{ border: "none", borderRadius: "50%" }}
            iconOnly
            ariaLabel="Decrease"
            variant="ghost"
            disabled={disabled || sliderValue <= min}
          />
          {showRange && <p aria-hidden="true">{min}</p>}
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
            className={styles.slider}
            style={{
              background: `linear-gradient(to right, ${accent} ${percentage}%, var(--irt-color-border) ${percentage}%)`,
            }}
          />
          {showRange && <p aria-hidden="true">{max}</p>}
          <Button
            iconLeft="plus"
            onClick={() => commit(sliderValue + step)}
            color={color}
            style={{ border: "none", borderRadius: "50%" }}
            iconOnly
            ariaLabel="Increase"
            variant="ghost"
            disabled={disabled || sliderValue >= max}
          />
          {required && (
            <p className={styles.required} aria-hidden="true">
              *
            </p>
          )}
        </div>
        {showValueSide !== "none" && (
          <div className={styles.sliderValue} aria-live="polite">
            {sliderValue}
          </div>
        )}
      </div>
    </div>
  );
}
