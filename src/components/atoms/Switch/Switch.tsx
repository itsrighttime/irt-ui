"use client";

import { useId, type CSSProperties, type KeyboardEvent } from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import styles from "./Switch.module.css";

export interface SwitchCustomStyles {
  container?: CSSProperties;
  label?: CSSProperties;
}

export interface SwitchProps {
  /** Checked state. Re-syncs when changed by the parent. @default false */
  value?: boolean;
  /** Called with the new state on toggle. */
  setResult: (value: boolean) => void;
  /** Track colour when on. @default var(--irt-color-primary) */
  color?: string;
  label?: string;
  disabled?: boolean;
  customStyles?: SwitchCustomStyles;
  required?: boolean;
  /** @default "300px" */
  width?: string;
  id?: string;
}

/** Accessible on/off toggle (`role="switch"`). */
export function Switch({
  value = false,
  setResult,
  color,
  label,
  disabled = false,
  customStyles = {},
  required = false,
  width = "300px",
  id,
}: SwitchProps) {
  const [checked, setChecked] = useSyncedState(value);
  const labelId = useId();

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    setResult(next);
  };

  return (
    <div
      className={styles.switchContainer}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)" }, { width, ...customStyles.container })}
    >
      {label && (
        <label id={labelId} className={styles.switchLabel} style={customStyles.label} onClick={toggle}>
          {label}
        </label>
      )}
      <div
        id={id}
        className={cx(styles.switch, checked ? styles.checked : styles.unchecked, disabled && styles.disabled)}
        onClick={toggle}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-labelledby={label ? labelId : undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
      >
        <div className={styles.switchHandle} />
      </div>
      {required && (
        <p className={styles.required} aria-hidden="true">
          *
        </p>
      )}
    </div>
  );
}
