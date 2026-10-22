export const getMonthsInRange = (
  restrictionStartDate: Date,
  restrictionEndDate: Date,
  locale = "en-US",
): string[] => {
  const months: string[] = [];

  const currentDate = new Date(
    restrictionStartDate.getFullYear(),
    restrictionStartDate.getMonth(),
    1,
  );

  const endDate = new Date(
    restrictionEndDate.getFullYear(),
    restrictionEndDate.getMonth(),
    1,
  );

  while (currentDate <= endDate) {
    months.push(
      `${currentDate.toLocaleString(locale, { month: "long" })} ${currentDate.getFullYear()}`,
    );

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
};

export const getYearsInRange = (
  restrictionStartDate: Date,
  restrictionEndDate: Date,
): number[] => {
  const years: number[] = [];

  const startYear = restrictionStartDate.getFullYear();
  const endYear = restrictionEndDate.getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
};
