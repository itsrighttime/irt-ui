import { render, screen, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { Alert } from "./Alert";
import { AlertContainer } from "./AlertContainer";
import { ErrorMsg } from "./ErrorMsg";

describe("Alert", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("auto-dismisses after the duration", () => {
    const onDismiss = vi.fn();
    render(<Alert message="Saved" type="success" onDismiss={onDismiss} duration={2000} />);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(400));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("dismisses manually and uses role=alert for errors", () => {
    const onDismiss = vi.fn();
    render(<Alert message="Failed" type="error" onDismiss={onDismiss} duration={0} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    act(() => vi.advanceTimersByTime(400));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("AlertContainer renders each alert and removes by id", () => {
    const removeAlert = vi.fn();
    render(
      <AlertContainer
        alertContainer={[
          { id: "a", message: "One", type: "info", duration: 0 },
          { id: "b", message: "Two", type: "warning", duration: 0 },
        ]}
        removeAlert={removeAlert}
      />,
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss" })[1] as HTMLElement);
    act(() => vi.advanceTimersByTime(400));
    expect(removeAlert).toHaveBeenCalledWith("b");
  });

  it("ErrorMsg renders the message", () => {
    render(<ErrorMsg message="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});
