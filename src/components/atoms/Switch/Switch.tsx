"use client";

import { useId, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import type { SizeToken } from "../../../theme/types";
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
  /** Track size. @default "medium" */
  size?: SizeToken;
  /** Label before (`start`) or after (`end`) the switch. @default "start" */
  labelPosition?: "start" | "end";
  /** Push the label and switch to opposite ends of `width` (settings-row layout). @default false */
  spread?: boolean;
  /** Secondary text under the label. */
  description?: ReactNode;
  /** Accessible name when there is no visible `label`. */
  ariaLabel?: string;
  className?: string;
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
  size = "medium",
  labelPosition = "start",
  spread = false,
  description,
  ariaLabel,
  className,
}: SwitchProps) {
  const [checked, setChecked] = useSyncedState(value);
  const labelId = useId();
  const descriptionId = useId();

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    setResult(next);
  };

  const labelBlock =
    label || description ? (
      <span className={styles.labelBlock}>
        {label && (
          <label id={labelId} className={styles.switchLabel} style={customStyles.label} onClick={toggle}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    ) : null;

  return (
    <div
      className={cx(
        styles.switchContainer,
        styles[size],
        labelPosition === "end" && styles.labelEnd,
        spread && styles.spread,
        disabled && styles.containerDisabled,
        className,
      )}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)" }, { width, ...customStyles.container })}
    >
      {labelBlock}
      <div
        id={id}
        className={cx(styles.switch, checked ? styles.checked : styles.unchecked, disabled && styles.disabled)}
        onClick={toggle}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={description ? descriptionId : undefined}
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
      {required && !label && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </div>
  );
}
