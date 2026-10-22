"use client";

import { useMemo, useState } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import styles from "./CalendarBox.module.css";
import type { CalendarProps, CalendarView } from "./Calendar.types";
import {
  canMoveNext,
  canMovePrev,
  getHeaderText,
  handleNext,
  handlePrev,
  handleViewChange,
} from "./calendarNavigation";
import { convertStrDate2Date } from "./handleDateChange";
import { isAfterDate } from "./handleDateCompare";
import { RenderCalendar } from "./RenderDates";
import { RenderMonths } from "./RenderMonths";
import { RenderYears } from "./RenderYears";

export type { CalendarProps, CalendarMode, CalendarView, MonthBase } from "./Calendar.types";

const DEFAULT_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Formats a date as `dd-mm-yyyy` using the given month base. */
export function formatCalendarDate(date: Date, monthBase: 0 | 1 = 0): string {
  return `${pad(date.getDate())}-${pad(date.getMonth() + monthBase)}-${date.getFullYear()}`;
}

/** Date / day / month / month-year / year picker grid. */
export function Calendar({
  isSmall = false,
  setResult,
  color,
  restrictionStartDate = null,
  restrictionEndDate = null,
  height = "100%",
  width = "100%",
  mode = "date",
  monthBase = 0,
  locale = "en-US",
  weekdayLabels = DEFAULT_WEEKDAYS,
}: CalendarProps) {
  const startDate = useMemo(
    () => (restrictionStartDate ? convertStrDate2Date(restrictionStartDate) : null),
    [restrictionStartDate],
  );
  const endDate = useMemo(() => (restrictionEndDate ? convertStrDate2Date(restrictionEndDate) : null), [restrictionEndDate]);

  if (startDate && endDate && isAfterDate(startDate, endDate)) {
    throw new Error("Calendar: restrictionStartDate must be before restrictionEndDate");
  }

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const today = new Date();
    if (startDate && endDate && (today < startDate || today > endDate)) {
      return new Date((startDate.getTime() + endDate.getTime()) / 2);
    }
    return today;
  });

  const [view, setView] = useState<CalendarView>(() =>
    mode === "year" ? "years" : mode === "month" || mode === "month-year" ? "months" : "calendar",
  );

  const showHeader = mode !== "month" && mode !== "day";
  const canPrev = !startDate || canMovePrev(view, currentDate, startDate);
  const canNext = !endDate || canMoveNext(view, currentDate, endDate);

  return (
    <div
      className={cx(styles.calendarBox, isSmall && styles.isSmall)}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-height": height, "--irt-c-width": width })}
    >
      {showHeader && (
        <div className={styles.calendarHeader}>
          {canPrev ? (
            <IconButton
              size={1}
              icon="chevronLeft"
              onClick={() => handlePrev(currentDate, setCurrentDate, startDate, view)}
              color={color}
              label="Previous"
            />
          ) : (
            <div />
          )}
          <h2 aria-live="polite">
            <button type="button" className={styles.headerButton} onClick={() => handleViewChange(setView, mode)}>
              {getHeaderText(currentDate, view, locale)}
            </button>
          </h2>
          {canNext ? (
            <IconButton
              size={1}
              icon="chevronRight"
              onClick={() => handleNext(currentDate, setCurrentDate, endDate, view)}
              color={color}
              label="Next"
            />
          ) : (
            <div />
          )}
        </div>
      )}

      {view === "calendar" && (
        <RenderCalendar
          isSmall={isSmall}
          date={currentDate}
          locale={locale}
          weekdayLabels={weekdayLabels}
          restrictionStartDate={startDate}
          restrictionEndDate={endDate}
          handleDateClick={(date) => {
            if (mode === "day") setResult(pad(date.getDate()));
            else setResult(formatCalendarDate(date, monthBase));
          }}
        />
      )}

      {view === "months" && (
        <RenderMonths
          isSmall={isSmall}
          year={currentDate.getFullYear()}
          locale={locale}
          restrictionStartDate={startDate}
          restrictionEndDate={endDate}
          handleMonthClick={(monthIndex, year) => {
            setCurrentDate(new Date(year, monthIndex, 1));
            const month = monthIndex + monthBase;
            if (mode === "month") setResult(month);
            else if (mode === "month-year") setResult(`${month}-${year}`);
            else setView("calendar");
          }}
        />
      )}

      {view === "years" && (
        <RenderYears
          isSmall={isSmall}
          startYear={currentDate.getFullYear() - 7}
          endYear={currentDate.getFullYear() + 8}
          restrictionStartYear={startDate ? startDate.getFullYear() : null}
          restrictionEndYear={endDate ? endDate.getFullYear() : null}
          handleYearClick={(year) => {
            setCurrentDate(new Date(year, 0, 1));
            if (mode === "year") setResult(year);
            else setView("months");
          }}
        />
      )}
    </div>
  );
}
