"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "../../../icons/Icon";
import type { BaseProps } from "../../../types/base-props";
import { cx } from "../../../utils/cx";
import { CustomDropdown } from "./CustomDropdown";
import styles from "./TimePicker.module.css";

export interface TimePickerProps extends Omit<BaseProps, "loading" | "tooltip" | "responsive" | "height"> {
  label?: string;
  /** `"hh:mm AM"`. @default "--:-- --" */
  value?: string;
  /** Called once per change with `"hh:mm AM|PM"` when the time is complete and valid. */
  setResult: (time: string) => void;
  /** @default "300px" */
  width?: string;
  required?: boolean;
  /** Earliest allowed time, e.g. `"08:30 AM"`. */
  minTime?: string;
  /** Latest allowed time, e.g. `"06:00 PM"`. */
  maxTime?: string;
  /** @default 1 */
  minuteStep?: number;
  /** @default 1 */
  hourStep?: number;
  /** Helper text under the field. */
  helperText?: ReactNode;
  /** Error message; overrides the built-in out-of-range message. */
  error?: ReactNode;
}

/** `"hh:mm AM/PM"` → minutes since midnight. */
export const convertToMinutes = (time: string): number => {
  const [clock = "", period] = time.split(" ");
  const [h = 0, m = 0] = clock.split(":").map(Number);
  let hours = h % 12;
  if (period === "PM") hours += 12;
  return hours * 60 + m;
};

interface TimeParts {
  hour: string;
  minute: string;
  period: string;
}

const parse = (value: string): TimeParts => {
  const [clock = "", period] = value.split(" ");
  const [hour, minute] = clock.split(":");
  return { hour: hour || "--", minute: minute || "--", period: period || "--" };
};

/** 12-hour time picker with min/max bounds and step options. */
export function TimePicker({
  label,
  value = "--:-- --",
  setResult,
  width = "300px",
  required = false,
  minTime,
  maxTime,
  minuteStep = 1,
  hourStep = 1,
  className,
  style,
  id,
  size = "medium",
  radius = "md",
  color,
  disabled = false,
  ariaLabel,
  helperText,
  error,
}: TimePickerProps) {
  const labelId = useId();
  const [local, setLocal] = useState<{ source: string; parts: TimeParts } | null>(null);
  const time = local && local.source === value ? local.parts : parse(value);

  const isValid = (t: TimeParts) => {
    if (t.hour === "--" || t.minute === "--" || t.period === "--") return true;
    const current = convertToMinutes(`${t.hour}:${t.minute} ${t.period}`);
    if (minTime && current < convertToMinutes(minTime)) return false;
    if (maxTime && current > convertToMinutes(maxTime)) return false;
    return true;
  };

  const update = (patch: Partial<TimeParts>) => {
    const next = { ...time, ...patch };
    setLocal({ source: value, parts: next });
    if (next.hour === "--" || next.minute === "--" || next.period === "--") return;
    if (!isValid(next)) return;
    setResult(`${next.hour}:${next.minute} ${next.period}`);
  };

  const outOfRange = !isValid(time);
  const invalid = outOfRange || Boolean(error);

  const hours = Array.from({ length: Math.ceil(12 / hourStep) }, (_, i) => String(i * hourStep + 1).padStart(2, "0"));
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => String(i * minuteStep).padStart(2, "0"));

  const rangeText =
    minTime && maxTime ? `${minTime} - ${maxTime}` : minTime ? `${minTime} - no max` : maxTime ? `no min - ${maxTime}` : "no time specified";

  const message = error ?? (outOfRange ? `Allowed: ${rangeText}` : helperText);

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel && label ? labelId : undefined}
      className={cx(styles.timeInputContainer, styles[size], disabled && styles.disabled, className)}
      style={{ maxWidth: width, ...style }}
    >
      {(label || required) && (
        <div className={styles.timeHeader}>
          {label && (
            <label id={labelId} className={styles.label}>
              {label}
              {required && (
                <span className={styles.required} aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}
          {!label && required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}

      <div className={cx(styles.timeSelectors, styles[`radius-${radius}`], invalid && styles.invalid)}>
        <span className={styles.clockIcon} aria-hidden="true">
          <Icon name="clock" size="1.05em" />
        </span>
        <CustomDropdown ariaLabel="Hours" options={hours} value={time.hour} onChange={(hour) => update({ hour })} color={color} error={invalid} disabled={disabled} />
        <span className={styles.colon} aria-hidden="true">
          :
        </span>
        <CustomDropdown ariaLabel="Minutes" options={minutes} value={time.minute} onChange={(minute) => update({ minute })} color={color} error={invalid} disabled={disabled} />
        <CustomDropdown ariaLabel="AM or PM" options={["AM", "PM"]} value={time.period} onChange={(period) => update({ period })} color={color} error={invalid} disabled={disabled} />
      </div>

      {message && (
        <p className={cx(styles.message, invalid && styles.error)} role={invalid ? "alert" : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
