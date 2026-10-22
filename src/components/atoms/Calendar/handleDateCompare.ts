import type { ComparisonType, DateInput } from "./Calendar.types";
import { convertStrDate2Date } from "./handleDateChange";

/**
 * Compare two dates based on comparison type
 * @param date1 Date or string in "DD-MM-YYYY" format
 * @param date2 Date or string in "DD-MM-YYYY" format
 * @param comparisonType "datewise" | "monthwise" | "yearwise"
 * @returns number: negative if date1 < date2, 0 if equal, positive if date1 > date2
 */
export const compareDates = (
  date1: DateInput,
  date2: DateInput,
  comparisonType: ComparisonType = "monthwise",
): number => {
  if (typeof date1 === "string") date1 = convertStrDate2Date(date1);
  if (typeof date2 === "string") date2 = convertStrDate2Date(date2);

  switch (comparisonType) {
    case "datewise":
      if (date1.getFullYear() !== date2.getFullYear())
        return date1.getFullYear() - date2.getFullYear();
      if (date1.getMonth() !== date2.getMonth())
        return date1.getMonth() - date2.getMonth();
      return date1.getDate() - date2.getDate();

    case "monthwise":
      if (date1.getFullYear() !== date2.getFullYear())
        return date1.getFullYear() - date2.getFullYear();
      return date1.getMonth() - date2.getMonth();

    case "yearwise":
      return date1.getFullYear() - date2.getFullYear();

    default:
      throw new Error("Invalid comparison type provided.");
  }
};

/**
 * Check if two dates are equal based on comparison type
 */
export const isDateEqual = (
  date1: DateInput,
  date2: DateInput,
  comparisonType: ComparisonType = "monthwise",
): boolean => {
  if (typeof date1 === "string") date1 = convertStrDate2Date(date1);
  if (typeof date2 === "string") date2 = convertStrDate2Date(date2);

  switch (comparisonType) {
    case "datewise":
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    case "monthwise":
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
      );
    case "yearwise":
      return date1.getFullYear() === date2.getFullYear();
    default:
      throw new Error("Invalid comparison type provided.");
  }
};

/**
 * Check if date1 is before date2 based on comparison type
 */
export const isBeforeDate = (
  date1: DateInput,
  date2: DateInput,
  comparisonType: ComparisonType = "monthwise",
): boolean => {
  if (typeof date1 === "string") date1 = convertStrDate2Date(date1);
  if (typeof date2 === "string") date2 = convertStrDate2Date(date2);

  switch (comparisonType) {
    case "datewise":
      return date1 < date2;
    case "monthwise":
      return (
        date1.getFullYear() < date2.getFullYear() ||
        (date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() < date2.getMonth())
      );
    case "yearwise":
      return date1.getFullYear() < date2.getFullYear();
    default:
      throw new Error("Invalid comparison type provided.");
  }
};

/**
 * Check if date1 is after date2 based on comparison type
 */
export const isAfterDate = (
  date1: DateInput,
  date2: DateInput,
  comparisonType: ComparisonType = "monthwise",
): boolean => {
  return (
    !isDateEqual(date1, date2, comparisonType) &&
    !isBeforeDate(date1, date2, comparisonType)
  );
};
