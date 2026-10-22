import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { OtpField } from "./OtpField";

const fill = (code: string) => {
  code.split("").forEach((c, i) => {
    fireEvent.change(screen.getByLabelText(`Digit ${i + 1} of ${code.length}`), { target: { value: c } });
  });
};

describe("OtpField", () => {
  it("emits the code without a verifier", () => {
    const setResult = vi.fn();
    render(<OtpField length={4} setResult={setResult} />);
    fill("1234");
    expect(setResult).toHaveBeenCalledWith("1234");
  });

  it("rejects non-digits when numeric", () => {
    const setResult = vi.fn();
    render(<OtpField length={2} setResult={setResult} />);
    fireEvent.change(screen.getByLabelText("Digit 1 of 2"), { target: { value: "a" } });
    expect(screen.getByLabelText("Digit 1 of 2")).toHaveValue("");
  });

  it("accepts a full paste", () => {
    const setResult = vi.fn();
    render(<OtpField length={4} setResult={setResult} />);
    fireEvent.paste(screen.getByLabelText("Digit 1 of 4"), { clipboardData: { getData: () => "98 76" } });
    expect(setResult).toHaveBeenCalledWith("9876");
  });

  it("uses an async verifier and resets on failure", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const setResult = vi.fn();
    const setError = vi.fn();
    const verify = vi.fn(async (code: string) => code === "1111");
    render(<OtpField length={4} setResult={setResult} setError={setError} verify={verify} resetDelay={100} />);
    fill("1234");
    await waitFor(() => expect(setResult).toHaveBeenCalledWith(null));
    expect(setError).toHaveBeenCalledWith("Invalid Code, Try Again!");
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveValue("");
    fill("1111");
    await waitFor(() => expect(setResult).toHaveBeenLastCalledWith("1111"));
    vi.useRealTimers();
  });
});
