import { render, screen, act, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("shows on focus, links aria-describedby, hides on blur", () => {
    render(
      <Tooltip content="Helpful">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button");
    act(() => trigger.focus());
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("Helpful");
    expect(trigger.getAttribute("aria-describedby")).toBe(tip.id);
    act(() => trigger.blur());
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens after the hover delay", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Later" delay={500}>
        <button>T</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).toBeNull();
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("keeps the child's own handlers and ref", () => {
    const onFocus = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tooltip content="x">
        <button ref={ref} onFocus={onFocus}>
          T
        </button>
      </Tooltip>,
    );
    act(() => screen.getByRole("button").focus());
    expect(onFocus).toHaveBeenCalled();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders only children without content", () => {
    render(
      <Tooltip content="">
        <button>T</button>
      </Tooltip>,
    );
    act(() => screen.getByRole("button").focus());
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
