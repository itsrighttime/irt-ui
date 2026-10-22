import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker, convertToMinutes } from "./TimePicker";

describe("TimePicker", () => {
  it("emits once per change (bug fix) when the time is complete", async () => {
    const setResult = vi.fn();
    render(<TimePicker label="Start" value="09:00 AM" setResult={setResult} />);
    await userEvent.click(screen.getByRole("button", { name: "Minutes: 00" }));
    await userEvent.click(screen.getByRole("option", { name: "30" }));
    expect(setResult).toHaveBeenCalledTimes(1);
    expect(setResult).toHaveBeenCalledWith("09:30 AM");
  });

  it("does not emit incomplete times", async () => {
    const setResult = vi.fn();
    render(<TimePicker setResult={setResult} />);
    await userEvent.click(screen.getByRole("button", { name: "Hours: --" }));
    await userEvent.click(screen.getByRole("option", { name: "10" }));
    expect(setResult).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Hours: 10" })).toBeInTheDocument();
  });

  it("flags times outside min/max", async () => {
    const setResult = vi.fn();
    render(<TimePicker value="09:00 AM" minTime="10:00 AM" maxTime="06:00 PM" setResult={setResult} />);
    expect(screen.getByRole("alert")).toHaveTextContent("10:00 AM - 06:00 PM");
    await userEvent.click(screen.getByRole("button", { name: "AM or PM: AM" }));
    await userEvent.click(screen.getByRole("option", { name: "PM" }));
    expect(setResult).not.toHaveBeenCalled();
    expect(convertToMinutes("12:15 AM")).toBe(15);
    expect(convertToMinutes("01:00 PM")).toBe(780);
  });

  it("re-syncs from the value prop", () => {
    const { rerender } = render(<TimePicker value="09:00 AM" setResult={() => undefined} />);
    rerender(<TimePicker value="11:15 PM" setResult={() => undefined} />);
    expect(screen.getByRole("button", { name: "Hours: 11" })).toBeInTheDocument();
  });
});
