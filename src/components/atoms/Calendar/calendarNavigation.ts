import type { Dispatch, SetStateAction } from "react";
import type { CalendarMode, CalendarView, ViewType } from "./Calendar.types";
import { handleDateChange } from "./handleDateChange";
import { isAfterDate, isBeforeDate } from "./handleDateCompare";

/**
 * Get header text based on current view
 */
export const getHeaderText = (currentDate: Date, view: ViewType, locale = "en-US"): string => {
  const monthName = currentDate.toLocaleString(locale, { month: "long" });
  const year = currentDate.getFullYear();

  switch (view) {
    case "calendar":
      return `${monthName.substring(0, 3)} ${year}`;
    case "months":
      return `${year}`;
    case "years":
      return `${year - 7} - ${year + 8}`;
    default:
      return "";
  }
};

/**
 * Handle clicking the previous button
 */
export const handlePrev = (
  currentDate: Date,
  setCurrentDate: (date: Date) => void,
  restrictionStartDate: Date | null,
  view: ViewType,
) => {
  switch (view) {
    case "calendar":
      handleDateChange(
        currentDate,
        setCurrentDate,
        -1,
        "month",
        restrictionStartDate,
      );
      break;
    case "months":
      handleDateChange(
        currentDate,
        setCurrentDate,
        -1,
        "year",
        restrictionStartDate,
      );
      break;
    case "years":
      handleDateChange(
        currentDate,
        setCurrentDate,
        -16,
        "year",
        restrictionStartDate,
      );
      break;
  }
};

/**
 * Handle clicking the next button
 */
export const handleNext = (
  currentDate: Date,
  setCurrentDate: (date: Date) => void,
  restrictionEndDate: Date | null,
  view: ViewType,
) => {
  switch (view) {
    case "calendar":
      handleDateChange(
        currentDate,
        setCurrentDate,
        1,
        "month",
        restrictionEndDate,
      );
      break;
    case "months":
      handleDateChange(
        currentDate,
        setCurrentDate,
        1,
        "year",
        restrictionEndDate,
      );
      break;
    case "years":
      handleDateChange(
        currentDate,
        setCurrentDate,
        16,
        "year",
        restrictionEndDate,
      );
      break;
  }
};

/**
 * Cycle through views: calendar -> months -> years -> calendar
 */
export const handleViewChange = (
  setView: Dispatch<SetStateAction<CalendarView>>,
  mode: CalendarMode,
) => {
  const viewMap: Record<
    CalendarMode,
    Partial<Record<CalendarView, CalendarView>>
  > = {
    // date & day share same cycle
    date: {
      calendar: "months",
      months: "years",
      years: "calendar",
    },
    day: {
      calendar: "months",
      months: "years",
      years: "calendar",
    },

    // month → stays on months
    month: {
      months: "months",
    },

    // month-year → toggle between months & years
    "month-year": {
      months: "years",
      years: "months",
    },

    // year → stays on years
    year: {
      years: "years",
    },
  };

  setView((prevView) => {
    const modeMap = viewMap[mode];

    return modeMap?.[prevView] ?? prevView;
  });
};

/**
 * Handle year selection
 */
export const handleYearSelection = (
  year: number,
  setCurrentDate: (date: Date) => void,
  setView: Dispatch<SetStateAction<ViewType>>,
) => {
  setCurrentDate(new Date(year, 0, 1));
  setView("months");
};

/**
 * Handle month selection
 */
export const handleMonthSelection = (
  monthYear: string,
  setCurrentDate: (date: Date) => void,
  setView: Dispatch<SetStateAction<ViewType>>,
) => {
  const [month = 0, year = new Date().getFullYear()] = monthYear.split("-").map(Number);
  setCurrentDate(new Date(year, month, 1));
  setView("calendar");
};

/**
 * Check if previous navigation is allowed
 */
export const canMovePrev = (
  view: ViewType,
  currentDate: Date,
  restrictionStartDate: Date,
): boolean => {
  switch (view) {
    case "calendar":
      return isAfterDate(currentDate, restrictionStartDate);
    case "months":
      return isAfterDate(currentDate, restrictionStartDate, "yearwise");
    case "years":
      return currentDate.getFullYear() - 7 > restrictionStartDate.getFullYear();
    default:
      return false;
  }
};

/**
 * Check if next navigation is allowed
 */
export const canMoveNext = (
  view: ViewType,
  currentDate: Date,
  restrictionEndDate: Date,
): boolean => {
  switch (view) {
    case "calendar":
      return isBeforeDate(currentDate, restrictionEndDate);
    case "months":
      return isBeforeDate(currentDate, restrictionEndDate, "yearwise");
    case "years":
      return currentDate.getFullYear() + 8 < restrictionEndDate.getFullYear();
    default:
      return false;
  }
};
