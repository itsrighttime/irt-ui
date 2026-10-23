"use client";

import { useState } from "react";
import { cx } from "../../../utils/cx";
import styles from "./CalendarBox.module.css";
import type { RenderMonthsProps } from "./Calendar.types";
import { cellProps } from "./cellProps";
import { gridKeyDown } from "./RenderDates";

/** 12-month grid for one year. @internal */
export function RenderMonths({
  isSmall = false,
  selectedMonth = null,
  year,
  handleMonthClick,
  restrictionStartDate,
  restrictionEndDate,
  locale,
}: RenderMonthsProps) {
  const [clicked, setClicked] = useState<number>(selectedMonth ?? -1);

  return (
    <div className={cx(styles.calendarBody, isSmall && styles.isSmall)}>
      <div className={cx(styles.calendar, styles.gridOf4, isSmall && styles.isSmall)} onKeyDown={(event) => gridKeyDown(event, 4)}>
        {Array.from({ length: 12 }, (_, i) => {
          const cellDate = new Date(year, i, 1);
          const afterStart =
            !restrictionStartDate ||
            year > restrictionStartDate.getFullYear() ||
            (year === restrictionStartDate.getFullYear() && i >= restrictionStartDate.getMonth());
          const beforeEnd =
            !restrictionEndDate ||
            year < restrictionEndDate.getFullYear() ||
            (year === restrictionEndDate.getFullYear() && i <= restrictionEndDate.getMonth());
          const inRange = afterStart && beforeEnd;
          const isClicked = i === clicked;
          return (
            <div
              key={i}
              className={cx(styles.contentBox, isClicked && inRange && styles.currentCell, !inRange && styles.restrictedCells)}
              {...cellProps(
                inRange,
                () => {
                  setClicked(i);
                  handleMonthClick(i, year);
                },
                isClicked,
                cellDate.toLocaleString(locale, { month: "long", year: "numeric" }),
              )}
            >
              {cellDate.toLocaleString(locale, { month: "short" })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RenderMonths;
