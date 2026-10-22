"use client";

import { useId } from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { cssVars } from "../../../utils/cssVars";
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
}

/** Numeric value with − / + buttons. */
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
}: StepperProps) {
  const [stepperValue, setStepperValue] = useSyncedState(value);
  const labelId = useId();

  const change = (delta: number) => {
    const next = stepperValue + delta;
    if (next < min || next > max) return;
    setStepperValue(next);
    setResult(next);
  };

  return (
    <div className={styles.stepperContainer} style={cssVars({ "--irt-c-color": color, "--irt-c-width": width })}>
      <div className={styles.header}>
        {label && (
          <label id={labelId} className={styles.stepperLabel}>
            {label}
          </label>
        )}
        {required && (
          <p className={styles.required} aria-hidden="true">
            *
          </p>
        )}
      </div>
      <div className={styles.stepperControls} role="group" aria-labelledby={label ? labelId : undefined}>
        <Button
          iconLeft="minus"
          onClick={() => change(-step)}
          color="var(--irt-c-color)"
          iconOnly
          ariaLabel="Decrease"
          variant="secondary"
          disabled={disabled || stepperValue - step < min}
        />
        <div className={styles.stepperOutput} aria-live="polite">
          {stepperValue}
        </div>
        <Button
          iconLeft="plus"
          onClick={() => change(step)}
          color="var(--irt-c-color)"
          iconOnly
          ariaLabel="Increase"
          variant="secondary"
          disabled={disabled || stepperValue + step > max}
        />
      </div>
    </div>
  );
}
