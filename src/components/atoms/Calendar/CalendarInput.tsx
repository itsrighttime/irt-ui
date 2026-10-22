"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import type { BaseProps } from "../../../types/base-props";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Calendar } from "./Calendar";
import type { CalendarMode, MonthBase } from "./Calendar.types";
import styles from "./CalendarInput.module.css";

export interface CalendarInputProps extends Pick<BaseProps, "className" | "style" | "disabled" | "width" | "height" | "color" | "id"> {
  mode: CalendarMode;
  /** Displayed value. */
  value?: string | number | null;
  /** Receives the selection (see `Calendar` for formats). */
  setResult: (value: string | number) => void;
  placeholder?: string;
  restrictionStartDate?: string | null;
  restrictionEndDate?: string | null;
  label?: string;
  required?: boolean;
  /** @default "full" */
  variant?: "full" | "underline";
  /** @default 0 (legacy) */
  monthBase?: MonthBase;
  locale?: string;
}

/** Input that opens a `Calendar` popup. Prefer the `*Picker` presets. */
export function CalendarInput({
  mode,
  value,
  setResult,
  placeholder = "",
  color,
  restrictionStartDate = null,
  restrictionEndDate = null,
  disabled = false,
  className,
  style,
  label,
  required = false,
  width = "300px",
  height = "40px",
  variant = "full",
  monthBase,
  locale,
  id,
}: CalendarInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoId = useId();
  const fieldId = id ?? autoId;
  const labelId = `${fieldId}-label`;
  const popupId = `${fieldId}-popup`;

  useClickOutside([containerRef], () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  const toggle = () => !disabled && setOpen((prev) => !prev);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      toggle();
    }
  };

  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <div
      ref={containerRef}
      className={cx(styles.calendarInputWrapper, styles[variant], className)}
      style={cssVars({ "--irt-c-width": width, "--irt-c-height": height }, style)}
    >
      {label && (
        <label id={labelId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.asterisk} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        id={fieldId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        aria-disabled={disabled || undefined}
        aria-labelledby={label ? `${labelId} ${fieldId}` : undefined}
        className={styles.inputBox}
        onClick={toggle}
        onKeyDown={onKeyDown}
        style={{
          borderColor: color ?? "var(--irt-color-border)",
          borderWidth: variant === "underline" ? "0 0 2px 0" : undefined,
          borderStyle: variant === "underline" ? "solid" : undefined,
        }}
      >
        <span style={{ color: hasValue ? (color ?? "var(--irt-color-text)") : "var(--irt-color-text-subtle)" }}>
          {hasValue ? value : placeholder}
        </span>
      </div>

      {open && (
        <div id={popupId} role="dialog" aria-label={label ?? "Choose date"} className={styles.dropdownCalendar} style={{ width: "100%" }}>
          <Calendar
            mode={mode}
            setResult={(next) => {
              setResult(next);
              setOpen(false);
            }}
            color={color}
            restrictionStartDate={restrictionStartDate}
            restrictionEndDate={restrictionEndDate}
            monthBase={monthBase}
            locale={locale}
            isSmall
          />
        </div>
      )}
    </div>
  );
}

export type CalendarPickerProps = Omit<CalendarInputProps, "mode">;
/** @deprecated Use `CalendarPickerProps`. */
export type CalendarPickerProp = CalendarPickerProps;

/** Picks a full date (`"dd-mm-yyyy"`). */
export const DatePicker = (props: CalendarPickerProps) => <CalendarInput {...props} mode="date" />;
/** Picks a day of month (`"dd"`). */
export const DayPicker = (props: CalendarPickerProps) => <CalendarInput {...props} mode="day" />;
/** Picks a month (number). */
export const MonthPicker = (props: CalendarPickerProps) => <CalendarInput {...props} mode="month" />;
/** Picks month and year (`"m-yyyy"`). */
export const MonthYearPicker = (props: CalendarPickerProps) => <CalendarInput {...props} mode="month-year" />;
/** Picks a year (number). */
export const YearPicker = (props: CalendarPickerProps) => <CalendarInput {...props} mode="year" />;
