import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar, formatCalendarDate } from "./Calendar";
import { DatePicker, MonthPicker, YearPicker } from "./CalendarInput";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true, now: new Date(2026, 9, 22) });
});
afterEach(() => vi.useRealTimers());

describe("Calendar", () => {
  it("emits legacy 0-based month by default (preserved behaviour)", () => {
    const setResult = vi.fn();
    render(<Calendar setResult={setResult} />);
    expect(screen.getByRole("button", { name: "Oct 2026" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "October 5, 2026" }));
    expect(setResult).toHaveBeenCalledWith("05-09-2026");
  });

  it("emits 1-based month with monthBase={1}", () => {
    const setResult = vi.fn();
    render(<Calendar setResult={setResult} monthBase={1} />);
    fireEvent.keyDown(screen.getByRole("button", { name: "October 5, 2026" }), { key: "Enter" });
    expect(setResult).toHaveBeenCalledWith("05-10-2026");
    expect(formatCalendarDate(new Date(2026, 0, 3), 1)).toBe("03-01-2026");
  });

  it("disables dates outside the restriction range", () => {
    const setResult = vi.fn();
    render(<Calendar setResult={setResult} restrictionStartDate="10-10-2026" restrictionEndDate="20-10-2026" />);
    const day5 = screen.getByRole("button", { name: "October 5, 2026" });
    expect(day5).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(day5);
    expect(setResult).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Previous" })).toBeNull();
  });

  it("navigates months and switches to the month view", async () => {
    render(<Calendar setResult={() => undefined} />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Nov 2026" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Nov 2026" }));
    expect(screen.getByRole("button", { name: "March 2026" })).toBeInTheDocument();
  });

  it("year mode emits a year", () => {
    const setResult = vi.fn();
    render(<Calendar mode="year" setResult={setResult} />);
    fireEvent.click(screen.getByRole("button", { name: "2030" }));
    expect(setResult).toHaveBeenCalledWith(2030);
  });

  it("throws on an inverted range", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() =>
      render(<Calendar setResult={() => undefined} restrictionStartDate="10-10-2026" restrictionEndDate="01-01-2026" />),
    ).toThrow(/restrictionStartDate/);
    err.mockRestore();
  });
});

describe("pickers", () => {
  it("DatePicker opens, selects and closes", async () => {
    const setResult = vi.fn();
    render(<DatePicker label="Due" placeholder="Pick" setResult={setResult} />);
    const trigger = screen.getByRole("button", { name: /Due/ });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "October 1, 2026" }));
    expect(setResult).toHaveBeenCalledWith("01-09-2026");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("MonthPicker and YearPicker emit numbers", async () => {
    const onMonth = vi.fn();
    const onYear = vi.fn();
    render(
      <>
        <MonthPicker placeholder="Month" setResult={onMonth} monthBase={1} />
        <YearPicker placeholder="Year" setResult={onYear} />
      </>,
    );
    await userEvent.click(screen.getByText("Month"));
    fireEvent.click(screen.getByRole("button", { name: "March 2026" }));
    expect(onMonth).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByText("Year"));
    fireEvent.click(screen.getByRole("button", { name: "2027" }));
    expect(onYear).toHaveBeenCalledWith(2027);
  });
});
