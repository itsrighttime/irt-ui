"use client";

import { useState } from "react";
import { cx } from "../../../utils/cx";
import styles from "./CalendarBox.module.css";
import type { RenderYearsProps } from "./Calendar.types";
import { cellProps } from "./cellProps";

/** 16-year grid. @internal */
export function RenderYears({
  isSmall = false,
  startYear,
  endYear,
  handleYearClick,
  restrictionStartYear,
  restrictionEndYear,
}: RenderYearsProps) {
  const [clicked, setClicked] = useState(-1);
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className={cx(styles.calendarBody, isSmall && styles.isSmall)}>
      <div className={cx(styles.calendar, isSmall && styles.isSmall, styles.gridOf4)}>
        {years.map((year) => {
          const inRange =
            (restrictionStartYear === null || year >= restrictionStartYear) &&
            (restrictionEndYear === null || year <= restrictionEndYear);
          const isClicked = year === clicked;
          return (
            <div
              key={year}
              className={cx(styles.contentBox, isClicked && inRange && styles.currentCell, !inRange && styles.restrictedCells)}
              {...cellProps(
                inRange,
                () => {
                  setClicked(year);
                  handleYearClick(year);
                },
                isClicked,
                String(year),
              )}
            >
              {year}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RenderYears;
