export type CalendarMode = "date" | "day" | "month" | "month-year" | "year";
export type CalendarView = "calendar" | "months" | "years";

/**
 * Month numbering in emitted values. `0` (legacy default) emits January as
 * `0` / `"00"`; `1` emits calendar months (January = `1` / `"01"`), matching
 * the `restriction*Date` input format.
 */
export type MonthBase = 0 | 1;

export interface CalendarProps {
  isSmall?: boolean;
  /**
   * Receives the selection: `"dd-mm-yyyy"` (date), `"dd"` (day), month
   * number (month), `"m-yyyy"` (month-year) or year number (year).
   */
  setResult: (value: string | number) => void;
  color?: string;
  /** Earliest selectable date, `"dd-mm-yyyy"` (1-based month). */
  restrictionStartDate?: string | null;
  /** Latest selectable date, `"dd-mm-yyyy"` (1-based month). */
  restrictionEndDate?: string | null;
  height?: string;
  width?: string;
  /** @default "date" */
  mode?: CalendarMode;
  /** Month numbering of emitted values. @default 0 (legacy) */
  monthBase?: MonthBase;
  /** Locale for month names (fixed default avoids SSR/client mismatches). @default "en-US" */
  locale?: string;
  /** Weekday column headers, Sunday first. @default ["S","M","T","W","T","F","S"] */
  weekdayLabels?: readonly string[];
  /** First column of the week: `0` Sunday, `1` Monday. @default 0 */
  firstDayOfWeek?: 0 | 1;
  /**
   * Currently selected value, in the same format `setResult` emits for the
   * `mode` (e.g. `"05-10-2026"` for dates). Highlights that cell and opens the
   * calendar on it. Today is always marked with a ring.
   */
  value?: string | number | null;
  /** Mark today's cell. @default true */
  highlightToday?: boolean;
  className?: string;
}

export type Period = "month" | "year";

export type ComparisonType = "datewise" | "monthwise" | "yearwise";
export type DateInput = Date | string;

export type ViewType = CalendarView;

export interface RenderCalendarProps {
  isSmall?: boolean;
  date: Date;
  selected?: Date | null;
  firstDayOfWeek?: 0 | 1;
  highlightToday?: boolean;
  handleDateClick: (date: Date) => void;
  restrictionStartDate: Date | null;
  restrictionEndDate: Date | null;
  weekdayLabels: readonly string[];
  locale: string;
}

export interface RenderMonthsProps {
  isSmall?: boolean;
  /** Selected month index (0–11) in `year`, if any. */
  selectedMonth?: number | null;
  year: number;
  handleMonthClick: (monthIndex: number, year: number) => void;
  restrictionStartDate: Date | null;
  restrictionEndDate: Date | null;
  locale: string;
}

export interface RenderYearsProps {
  isSmall?: boolean;
  selectedYear?: number | null;
  startYear: number;
  endYear: number;
  handleYearClick: (year: number) => void;
  restrictionStartYear: number | null;
  restrictionEndYear: number | null;
}
