"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "../../../icons/Icon";
import type { BaseProps } from "../../../types/base-props";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Popover } from "../Overlay/Popover";
import { Calendar } from "./Calendar";
import type { CalendarMode, MonthBase } from "./Calendar.types";
import styles from "./CalendarInput.module.css";

export interface CalendarInputProps extends Pick<BaseProps, "className" | "style" | "disabled" | "width" | "height" | "color" | "id"> {
  mode: CalendarMode;
  /** Displayed value; also highlighted in the calendar. */
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
  /** First column of the week: `0` Sunday, `1` Monday. @default 0 */
  firstDayOfWeek?: 0 | 1;
  /** Format the displayed value (e.g. to show "5 Oct 2026"). */
  formatValue?: (value: string | number) => string;
  /** Show a clear (×) button when a value is set. Clearing emits `""`. @default false */
  clearable?: boolean;
  /** Helper text under the field. */
  helperText?: ReactNode;
  /** Error message (also marks the field invalid). */
  error?: ReactNode;
  /** Use the compact calendar in the popup. @default false */
  compact?: boolean;
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
  firstDayOfWeek,
  formatValue,
  clearable = false,
  helperText,
  error,
  compact = false,
}: CalendarInputProps) {
  const [open, setOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const autoId = useId();
  const fieldId = id ?? autoId;
  const labelId = `${fieldId}-label`;
  const popupId = `${fieldId}-popup`;
  const messageId = `${fieldId}-msg`;
  const message = error || helperText;

  const close = () => {
    setOpen(false);
    fieldRef.current?.focus();
  };
  const toggle = () => !disabled && setOpen((prev) => !prev);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      toggle();
    } else if ((event.key === "Backspace" || event.key === "Delete") && clearable && hasValue) {
      event.preventDefault();
      setResult("");
    }
  };

  const hasValue = value !== undefined && value !== null && value !== "";
  const display = hasValue ? (formatValue ? formatValue(value) : String(value)) : placeholder;

  return (
    <div
      className={cx(styles.calendarInputWrapper, styles[variant], Boolean(error) && styles.invalid, disabled && styles.disabled, className)}
      style={cssVars(
        { "--irt-c-width": width, "--irt-c-height": height, "--irt-c-color": color ?? "var(--irt-color-primary)" },
        style,
      )}
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
        ref={fieldRef}
        id={fieldId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        aria-disabled={disabled || undefined}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={message ? messageId : undefined}
        aria-labelledby={label ? `${labelId} ${fieldId}` : undefined}
        className={cx(styles.inputBox, open && styles.open)}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={cx(styles.value, !hasValue && styles.placeholder)}>{display}</span>
        <span className={styles.adornments}>
          {clearable && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              className={styles.clear}
              onClick={(event) => {
                event.stopPropagation();
                setResult("");
              }}
            >
              <Icon name="close" size="0.95em" />
            </span>
          )}
          <span className={styles.icon} aria-hidden="true">
            <Icon name="calendar" size="1.05em" />
          </span>
        </span>
      </div>

      {message && (
        <span id={messageId} className={cx(styles.helperText, Boolean(error) && styles.errorText)} role={error ? "alert" : undefined}>
          {message}
        </span>
      )}

      <Popover anchorRef={fieldRef} isOpen={open} onClose={() => setOpen(false)} flip offset={4} style={{ minWidth: compact ? 220 : 288 }}>
        <div id={popupId} role="dialog" aria-label={label ?? "Choose date"} className={styles.dropdownCalendar}>
          <Calendar
            mode={mode}
            value={value}
            setResult={(next) => {
              setResult(next);
              close();
            }}
            color={color}
            restrictionStartDate={restrictionStartDate}
            restrictionEndDate={restrictionEndDate}
            monthBase={monthBase}
            locale={locale}
            firstDayOfWeek={firstDayOfWeek}
            isSmall={compact}
          />
        </div>
      </Popover>
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
