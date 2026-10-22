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
}

export type Period = "month" | "year";

export type ComparisonType = "datewise" | "monthwise" | "yearwise";
export type DateInput = Date | string;

export type ViewType = CalendarView;

export interface RenderCalendarProps {
  isSmall?: boolean;
  date: Date;
  handleDateClick: (date: Date) => void;
  restrictionStartDate: Date | null;
  restrictionEndDate: Date | null;
  weekdayLabels: readonly string[];
  locale: string;
}

export interface RenderMonthsProps {
  isSmall?: boolean;
  year: number;
  handleMonthClick: (monthIndex: number, year: number) => void;
  restrictionStartDate: Date | null;
  restrictionEndDate: Date | null;
  locale: string;
}

export interface RenderYearsProps {
  isSmall?: boolean;
  startYear: number;
  endYear: number;
  handleYearClick: (year: number) => void;
  restrictionStartYear: number | null;
  restrictionEndYear: number | null;
}
