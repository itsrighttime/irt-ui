import type { Period } from "./Calendar.types";

const updateDate = (
  currentDate: Date,
  change: number,
  period: Period,
): Date => {
  const newDate = new Date(currentDate);
  if (period === "month") {
    newDate.setMonth(newDate.getMonth() + change);
  } else if (period === "year") {
    newDate.setFullYear(newDate.getFullYear() + change);
  }
  // Always return start of the month
  return new Date(newDate.getFullYear(), newDate.getMonth(), 1);
};

/** Parses `"dd-mm-yyyy"` (1-based month) into a local `Date`. */
export const convertStrDate2Date = (strDate: string): Date => {
  const [day = 1, month = 1, year = 1970] = strDate.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const handleDateChange = (
  currentDate: Date,
  setCurrentDate: (date: Date) => void,
  change: number,
  period: Period = "month",
  restrictionDate: Date | null = null,
): void => {
  const newDate = updateDate(currentDate, change, period);

  if (restrictionDate) {
    // Convert restrictionDate to start of the month for comparison
    const restriction = new Date(
      restrictionDate.getFullYear(),
      restrictionDate.getMonth(),
      1,
    );

    if (period === "month" || period === "year") {
      if (
        (change > 0 && newDate <= restriction) ||
        (change < 0 && newDate >= restriction)
      ) {
        setCurrentDate(newDate);
      }
    }
  } else {
    setCurrentDate(newDate);
  }
};

/*
Use Cases:

// Months
handleDateChange(currentDate, setCurrentDate, 1, "month"); // Next month
handleDateChange(currentDate, setCurrentDate, -1, "month"); // Previous month
handleDateChange(currentDate, setCurrentDate, 1, "month", new Date()); // Next month with restriction
handleDateChange(currentDate, setCurrentDate, -1, "month", new Date()); // Previous month with restriction

// Years
handleDateChange(currentDate, setCurrentDate, 1, "year"); // Next year
handleDateChange(currentDate, setCurrentDate, -1, "year"); // Previous year
handleDateChange(currentDate, setCurrentDate, 1, "year", new Date()); // Next year with restriction
handleDateChange(currentDate, setCurrentDate, -1, "year", new Date()); // Previous year with restriction
*/
