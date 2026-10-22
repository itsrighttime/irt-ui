"use client";

import { useState, type KeyboardEvent, type ReactElement } from "react";
import { cx } from "../../../utils/cx";
import styles from "./CalendarBox.module.css";
import type { RenderCalendarProps } from "./Calendar.types";
import { cellProps } from "./cellProps";

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** Arrow-key navigation between enabled cells of a grid (roving focus). @internal */
export function gridKeyDown(event: KeyboardEvent<HTMLDivElement>, columns: number): void {
  const deltas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -columns, ArrowDown: columns };
  const all = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[role=button]"));
  const index = all.indexOf(document.activeElement as HTMLElement);
  if (index === -1) return;
  let target: HTMLElement | undefined;
  if (event.key in deltas) {
    let i = index + (deltas[event.key] ?? 0);
    while (i >= 0 && i < all.length && all[i]?.getAttribute("aria-disabled") === "true") i += Math.sign(deltas[event.key] ?? 1);
    target = all[i];
  } else if (event.key === "Home") {
    target = all.find((el) => el.getAttribute("aria-disabled") !== "true");
  } else if (event.key === "End") {
    target = [...all].reverse().find((el) => el.getAttribute("aria-disabled") !== "true");
  } else {
    return;
  }
  event.preventDefault();
  if (target) {
    all.forEach((el) => el.setAttribute("tabindex", "-1"));
    target.setAttribute("tabindex", "0");
    target.focus();
  }
}

/** Day grid for one month. @internal */
export function RenderCalendar({
  isSmall = false,
  date,
  selected = null,
  firstDayOfWeek = 0,
  highlightToday = true,
  handleDateClick,
  restrictionStartDate,
  restrictionEndDate,
  weekdayLabels,
  locale,
}: RenderCalendarProps) {
  const [clicked, setClicked] = useState<Date | null>(selected);
  const [syncedFrom, setSyncedFrom] = useState<Date | null>(selected);
  if (selected?.getTime() !== syncedFrom?.getTime()) {
    setSyncedFrom(selected);
    setClicked(selected);
  }

  const today = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = (new Date(year, month, 1).getDay() - firstDayOfWeek + 7) % 7;
  const lastDate = new Date(year, month + 1, 0).getDate();
  const labels = firstDayOfWeek === 1 ? [...weekdayLabels.slice(1), ...weekdayLabels.slice(0, 1)] : weekdayLabels;

  const inRange = (d: Date) => (!restrictionStartDate || d >= restrictionStartDate) && (!restrictionEndDate || d <= restrictionEndDate);

  // The single tabbable cell: selected → today → first enabled day.
  let tabbableDay = -1;
  for (let day = 1; day <= lastDate; day++) {
    const d = new Date(year, month, day);
    if (!inRange(d)) continue;
    if (clicked && sameDay(d, clicked)) {
      tabbableDay = day;
      break;
    }
    if (sameDay(d, today)) tabbableDay = day;
    else if (tabbableDay === -1) tabbableDay = day;
  }

  const cells: ReactElement[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className={styles.emptyBox} aria-hidden="true" />);
  }
  for (let day = 1; day <= lastDate; day++) {
    const cellDate = new Date(year, month, day);
    const isClicked = clicked !== null && sameDay(cellDate, clicked);
    const enabled = inRange(cellDate);
    const isToday = highlightToday && sameDay(cellDate, today);
    cells.push(
      <div
        key={day}
        className={cx(
          styles.contentBox,
          isToday && styles.today,
          isClicked && enabled && styles.currentCell,
          !enabled && styles.restrictedCells,
        )}
        aria-current={isToday ? "date" : undefined}
        {...cellProps(
          enabled,
          () => {
            setClicked(cellDate);
            handleDateClick(cellDate);
          },
          isClicked,
          cellDate.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }),
          day === tabbableDay,
        )}
      >
        {day}
      </div>,
    );
  }

  return (
    <div className={cx(styles.calendarBody, isSmall && styles.isSmall)}>
      <div className={cx(styles.calendarDays, isSmall && styles.isSmall)} aria-hidden="true">
        {labels.map((label, i) => (
          <div key={i}>{label}</div>
        ))}
      </div>
      <div className={cx(styles.calendar, isSmall && styles.isSmall)} onKeyDown={(event) => gridKeyDown(event, 7)}>
        {cells}
      </div>
    </div>
  );
}

export default RenderCalendar;
