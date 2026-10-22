import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";
import { Slider } from "../Slider/Slider";
import { Stepper } from "../Stepper/Stepper";

describe("Switch", () => {
  it("toggles by click and keyboard and reports the value", async () => {
    const setResult = vi.fn();
    render(<Switch label="Notifications" setResult={setResult} />);
    const sw = screen.getByRole("switch", { name: "Notifications" });
    await userEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
    fireEvent.keyDown(sw, { key: " " });
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(setResult.mock.calls).toEqual([[true], [false]]);
  });

  it("re-syncs when the parent changes value", () => {
    const { rerender } = render(<Switch value={false} setResult={() => undefined} />);
    rerender(<Switch value setResult={() => undefined} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("ignores input when disabled", async () => {
    const setResult = vi.fn();
    render(<Switch disabled setResult={setResult} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(setResult).not.toHaveBeenCalled();
  });
});

describe("Slider", () => {
  it("emits from the range input and the ± buttons (bug fix)", async () => {
    const setResult = vi.fn();
    render(<Slider label="Volume" value={50} step={10} setResult={setResult} />);
    fireEvent.change(screen.getByLabelText("Volume"), { target: { value: "70" } });
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(setResult.mock.calls).toEqual([[70], [80], [70]]);
  });

  it("clamps to min/max", async () => {
    const setResult = vi.fn();
    render(<Slider value={99} step={5} setResult={setResult} />);
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(setResult).toHaveBeenLastCalledWith(100);
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
  });
});

describe("Stepper", () => {
  it("steps within bounds", async () => {
    const setResult = vi.fn();
    render(<Stepper label="Qty" value={0} step={5} max={10} setResult={setResult} />);
    expect(screen.getByRole("button", { name: "Decrease" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(setResult.mock.calls).toEqual([[5], [10]]);
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
  });

  it("re-syncs from a non-zero value change (bug fix)", () => {
    const { rerender } = render(<Stepper value={5} setResult={() => undefined} />);
    rerender(<Stepper value={20} setResult={() => undefined} />);
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
