import { render, screen, fireEvent, act, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cssVars } from "../../utils/cssVars";
import { Alert } from "./Alert/Alert";
import { IconButton } from "./Button/IconButton";
import { Button } from "./Button/Button";
import { Modal } from "./Overlay/Modal";
import { Dialog } from "./Overlay/Dialog";
import { Dropdown } from "./Selection/Dropdown";
import { CheckboxGroup } from "./Selection/CheckboxGroup";
import { Switch } from "./Switch/Switch";
import { Stepper } from "./Stepper/Stepper";
import { Slider } from "./Slider/Slider";
import { Calendar } from "./Calendar/Calendar";
import { Table } from "./Table/Table";
import { TextInput } from "./TextInput/TextInput";
import { ErrorPage } from "./ErrorPage/ErrorPage";
import { Tabs } from "./Tabs/Tabs";
import { Badge } from "./Badge/Badge";

describe("cssVars", () => {
  it("resets undefined component-local vars so they never inherit", () => {
    expect(cssVars({ "--irt-c-width": undefined, "--irt-color-x": undefined, "--irt-c-height": "40px" })).toEqual({
      "--irt-c-width": "initial",
      "--irt-c-height": "40px",
    });
  });

  it("a Button inside a sized TextInput does not inherit the input's width", () => {
    render(<TextInput label="Password" textType="password" width="400px" />);
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.style.getPropertyValue("--irt-c-width")).toBe("initial");
  });
});

describe("IconButton", () => {
  it("supports variants, shape and pressed state", () => {
    render(<IconButton icon="bell" label="Alerts" variant="soft" shape="circle" active />);
    const button = screen.getByRole("button", { name: "Alerts" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button.className).toMatch(/soft/);
    expect(button.className).toMatch(/circle/);
  });

  it("isBorder maps to the outline variant (backwards compatible)", () => {
    render(<IconButton icon="bell" label="Alerts" isBorder />);
    expect(screen.getByRole("button", { name: "Alerts" }).className).toMatch(/outline/);
  });
});

describe("Button", () => {
  it("marks loading buttons busy and disabled", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});

describe("Alert", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders a title, type icon and action, and pauses on hover", () => {
    const onDismiss = vi.fn();
    render(<Alert type="info" title="Heads up" message="Body" action={<button type="button">Undo</button>} duration={2000} onDismiss={onDismiss} />);
    const alert = screen.getByRole("status");
    expect(within(alert).getByText("Heads up")).toBeInTheDocument();
    expect(within(alert).getByRole("button", { name: "Undo" })).toBeInTheDocument();
    expect(alert.querySelector("svg")).not.toBeNull();
    fireEvent.mouseEnter(alert);
    for (let i = 0; i < 5; i++) act(() => vi.advanceTimersByTime(1000));
    expect(onDismiss).not.toHaveBeenCalled();
    fireEvent.mouseLeave(alert);
    for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(1000));
    act(() => vi.advanceTimersByTime(400));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("can hide the dismiss button", () => {
    render(<Alert type="success" message="Saved" dismissible={false} duration={0} onDismiss={() => undefined} />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
  });
});

describe("Modal", () => {
  it("labels itself from title and renders a footer", () => {
    render(
      <Modal isOpen onClose={() => undefined} title="Invite" description="Send an invite" footer={<button type="button">Send</button>}>
        <input aria-label="email" />
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Invite" });
    expect(dialog).toHaveAccessibleDescription("Send an invite");
    expect(within(dialog).getByRole("button", { name: "Send" })).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toHaveFocus();
  });

  it("locks page scroll while open", () => {
    const { unmount } = render(
      <Modal isOpen onClose={() => undefined} ariaLabel="x">
        <p>body</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});

describe("Dialog", () => {
  it("moves between tabs with arrow keys and can show labels", async () => {
    render(
      <Dialog
        isOpen
        onClose={() => undefined}
        title="Settings"
        showLabels
        items={[
          { key: "profile", icon: "user", component: <p>Profile panel</p> },
          { key: "security", icon: "lock", component: <p>Security panel</p> },
        ]}
      />,
    );
    const first = screen.getByRole("tab", { name: "Profile" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(await screen.findByText("Security panel")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("Dropdown", () => {
  it("accepts option objects, shows the label and skips disabled options", async () => {
    const setResult = vi.fn();
    render(
      <Dropdown
        placeholder="Plan"
        options={[
          { value: "free", label: "Free", description: "For individuals" },
          { value: "pro", label: "Pro" },
          { value: "team", label: "Team", disabled: true },
        ]}
        value={["free"]}
        setResult={setResult}
      />,
    );
    const combo = screen.getByRole("combobox", { name: "Plan" });
    expect(combo).toHaveTextContent("Free");
    await userEvent.click(combo);
    await userEvent.click(screen.getByRole("option", { name: /Team/ }));
    expect(setResult).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("option", { name: /Pro/ }));
    expect(setResult).toHaveBeenCalledWith(["pro"]);
  });

  it("shows helper and error text", () => {
    render(<Dropdown options={["a"]} placeholder="Pick" error="Required" setResult={() => undefined} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});

describe("CheckboxGroup", () => {
  it("renders error text and the card variant", () => {
    render(<CheckboxGroup label="Topics" options={["a"]} variant="card" error="Pick one" setResult={() => undefined} />);
    const group = screen.getByRole("group", { name: /Topics/ });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(within(group).getByRole("alert")).toHaveTextContent("Pick one");
  });
});

describe("Switch", () => {
  it("supports a description and aria-label without a visible label", async () => {
    const setResult = vi.fn();
    render(<Switch ariaLabel="Dark mode" description="Use dark colours" setResult={setResult} />);
    const toggle = screen.getByRole("switch", { name: "Dark mode" });
    expect(toggle).toHaveAccessibleDescription("Use dark colours");
    await userEvent.click(toggle);
    expect(setResult).toHaveBeenCalledWith(true);
  });
});

describe("Stepper", () => {
  it("is a spinbutton driven by arrow / Home / End keys", () => {
    const setResult = vi.fn();
    render(<Stepper label="Seats" value={10} step={5} min={0} max={50} setResult={setResult} />);
    const spin = screen.getByRole("spinbutton", { name: "Seats" });
    fireEvent.keyDown(spin, { key: "ArrowUp" });
    expect(setResult).toHaveBeenLastCalledWith(15);
    fireEvent.keyDown(spin, { key: "End" });
    expect(setResult).toHaveBeenLastCalledWith(50);
    fireEvent.keyDown(spin, { key: "Home" });
    expect(setResult).toHaveBeenLastCalledWith(0);
  });
});

describe("Slider", () => {
  it("formats the value and can hide the step buttons", () => {
    render(<Slider label="Volume" value={40} showValueSide="right" showButtons={false} formatValue={(v) => `${v}%`} setResult={() => undefined} />);
    expect(screen.queryByRole("button", { name: "Increase" })).toBeNull();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute("aria-valuetext", "40%");
  });
});

describe("Calendar", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true, now: new Date(2026, 9, 22) }));
  afterEach(() => vi.useRealTimers());

  it("marks today separately from the selected value", () => {
    render(<Calendar value="05-10-2026" monthBase={1} setResult={() => undefined} />);
    expect(screen.getByRole("button", { name: "October 22, 2026" })).toHaveAttribute("aria-current", "date");
    expect(screen.getByRole("button", { name: "October 22, 2026" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "October 5, 2026" })).toHaveAttribute("aria-pressed", "true");
  });

  it("supports Monday as the first day and arrow-key navigation", () => {
    render(<Calendar firstDayOfWeek={1} setResult={() => undefined} />);
    const today = screen.getByRole("button", { name: "October 22, 2026" });
    expect(today).toHaveAttribute("tabindex", "0");
    today.focus();
    fireEvent.keyDown(today, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "October 23, 2026" })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: "October 30, 2026" })).toHaveFocus();
  });
});

describe("Table", () => {
  const rows = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}`, locked: i === 0 }));

  it("shows a range footer, a toolbar title and per-row action rules", async () => {
    const onEdit = vi.fn();
    render(
      <Table
        title="Accounts"
        data={rows}
        pageSize={5}
        columns={[{ key: "name", title: "Name" }]}
        controls={{ columnSelector: false, search: false }}
        showRowDetails={false}
        rowActions={[
          { label: "Edit", icon: "edit", onClick: onEdit, disabled: (row) => row.locked },
          { label: "Delete", variant: "danger", onClick: () => undefined, hidden: (row) => row.locked },
        ]}
      />,
    );
    expect(screen.getByText("Accounts")).toBeInTheDocument();
    expect(screen.getByText("1–5 of 7")).toBeInTheDocument();
    const editButtons = screen.getAllByRole("button", { name: "Edit" });
    expect(editButtons[0]).toBeDisabled();
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(4);
    await userEvent.click(editButtons[1] as HTMLElement);
    expect(onEdit).toHaveBeenCalledWith(rows[1], expect.anything());
  });

  it("marks the scroll area busy while loading", () => {
    render(<Table data={rows} columns={[{ key: "name", title: "Name" }]} loading controls={{ search: false, columnSelector: false, pagination: false }} />);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});

describe("ErrorPage", () => {
  it("can render as a section with custom title and actions", () => {
    const { container } = render(
      <ErrorPage as="section" fullHeight={false} statusCode={500} title="Something broke" handleNavigate="/" actions={<button type="button">Retry</button>} />,
    );
    expect(container.querySelector("main")).toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "Something broke" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

describe("Tabs", () => {
  it("switches panels by click and arrow keys, skipping disabled tabs", async () => {
    const onChange = vi.fn();
    render(
      <Tabs
        ariaLabel="Sections"
        onChange={onChange}
        items={[
          { key: "a", label: "Alpha", content: <p>Panel A</p> },
          { key: "b", label: "Beta", content: <p>Panel B</p>, disabled: true },
          { key: "c", label: "Gamma", content: <p>Panel C</p>, badge: 3 },
        ]}
      />,
    );
    expect(screen.getByRole("tabpanel", { name: "Alpha" })).toHaveTextContent("Panel A");
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Gamma/ })).toHaveFocus();
    expect(screen.getByText("Panel C")).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith("c");
    await userEvent.click(alpha);
    expect(screen.getByText("Panel A")).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("renders text with an optional dot", () => {
    const { container } = render(
      <Badge tone="success" dot>
        Active
      </Badge>,
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(container.querySelectorAll("span[aria-hidden='true']")).toHaveLength(1);
  });
});
