"use client";

import { useState, type ReactElement } from "react";
import { cx } from "../../../utils/cx";
import styles from "./CalendarBox.module.css";
import type { RenderCalendarProps } from "./Calendar.types";
import { cellProps } from "./cellProps";

/** Day grid for one month. @internal */
export function RenderCalendar({
  isSmall = false,
  date,
  handleDateClick,
  restrictionStartDate,
  restrictionEndDate,
  weekdayLabels,
  locale,
}: RenderCalendarProps) {
  // Today is highlighted initially (original behaviour).
  const [clicked, setClicked] = useState<Date | null>(() => new Date());
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const cells: ReactElement[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className={styles.emptyBox} aria-hidden="true" />);
  }
  for (let day = 1; day <= lastDate; day++) {
    const cellDate = new Date(year, month, day);
    const isClicked = clicked !== null && cellDate.toDateString() === clicked.toDateString();
    const inRange =
      (!restrictionStartDate || cellDate >= restrictionStartDate) &&
      (!restrictionEndDate || cellDate <= restrictionEndDate);
    cells.push(
      <div
        key={day}
        className={cx(styles.contentBox, isClicked && inRange && styles.currentCell, !inRange && styles.restrictedCells)}
        {...cellProps(
          inRange,
          () => {
            setClicked(cellDate);
            handleDateClick(cellDate);
          },
          isClicked,
          cellDate.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }),
        )}
      >
        {day}
      </div>,
    );
  }

  return (
    <div className={cx(styles.calendarBody, isSmall && styles.isSmall)}>
      <div className={cx(styles.calendarDays, isSmall && styles.isSmall)} aria-hidden="true">
        {weekdayLabels.map((label, i) => (
          <div key={i}>{label}</div>
        ))}
      </div>
      <div className={cx(styles.calendar, isSmall && styles.isSmall)}>{cells}</div>
    </div>
  );
}

export default RenderCalendar;
