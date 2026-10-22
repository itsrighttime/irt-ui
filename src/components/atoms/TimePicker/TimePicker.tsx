"use client";

import { useId, useState } from "react";
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

  const invalid = !isValid(time);

  const hours = Array.from({ length: Math.ceil(12 / hourStep) }, (_, i) => String(i * hourStep + 1).padStart(2, "0"));
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => String(i * minuteStep).padStart(2, "0"));

  const rangeText =
    minTime && maxTime ? `${minTime} - ${maxTime}` : minTime ? `${minTime} - no max` : maxTime ? `no min - ${maxTime}` : "no time specified";

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel && label ? labelId : undefined}
      className={cx(styles.timeInputContainer, styles[size], styles[`radius-${radius}`], disabled && styles.disabled, className)}
      style={{ maxWidth: width, ...style }}
    >
      <div className={styles.timeHeader}>
        {label && (
          <label id={labelId} className={styles.label}>
            {label}
          </label>
        )}
        {required && (
          <p className={styles.required} aria-hidden="true">
            *
          </p>
        )}
      </div>

      <div className={styles.timeSelectors}>
        <CustomDropdown ariaLabel="Hours" options={hours} value={time.hour} onChange={(hour) => update({ hour })} color={color} error={invalid} disabled={disabled} />
        <span className={styles.colon} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path fill="currentColor" d="M4 3V2h1v1m0 3H4V5h1" />
          </svg>
        </span>
        <CustomDropdown ariaLabel="Minutes" options={minutes} value={time.minute} onChange={(minute) => update({ minute })} color={color} error={invalid} disabled={disabled} />
        <CustomDropdown ariaLabel="AM or PM" options={["AM", "PM"]} value={time.period} onChange={(period) => update({ period })} color={color} error={invalid} disabled={disabled} />
      </div>

      {invalid && (
        <div className={styles.timeHeader}>
          <p className={styles.error} role="alert">
            {rangeText}
          </p>
        </div>
      )}
    </div>
  );
}
