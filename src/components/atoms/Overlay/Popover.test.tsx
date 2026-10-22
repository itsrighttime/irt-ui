import { useRef, useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Popover } from "./Popover";
import { DynamicPopover } from "./DynamicPopover";

function Harness({ dynamic = false }: { dynamic?: boolean }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button ref={ref}>anchor</button>
      <span>outside</span>
      {dynamic ? (
        <DynamicPopover anchorRef={ref} isOpen={open} onClose={() => setOpen(false)}>
          {({ placement }) => <div>placement:{placement}</div>}
        </DynamicPopover>
      ) : (
        <Popover anchorRef={ref} isOpen={open} onClose={() => setOpen(false)}>
          <div>content</div>
        </Popover>
      )}
    </div>
  );
}

describe("Popover", () => {
  it("renders into a portal and closes on outside click", () => {
    render(<Harness />);
    expect(screen.getByText("content")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByText("outside"));
    expect(screen.queryByText("content")).toBeNull();
  });

  it("closes on Escape", () => {
    render(<Harness />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("content")).toBeNull();
  });

  it("does not close when clicking the anchor", () => {
    render(<Harness />);
    fireEvent.mouseDown(screen.getByText("anchor"));
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("DynamicPopover passes placement to children", () => {
    render(<Harness dynamic />);
    expect(screen.getByText(/placement:(top|bottom)/)).toBeInTheDocument();
  });
});
