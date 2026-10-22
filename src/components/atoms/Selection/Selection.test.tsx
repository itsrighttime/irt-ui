import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxGroup } from "./CheckboxGroup";
import { RadioGroup } from "./RadioGroup";
import { Dropdown } from "./Dropdown";
import { SingleDropdown } from "./Dropdowns";
import { DropdownSimple } from "./DropdownSimple";
import type { SelectionValue } from "./SelectionBox";

function Checks() {
  const [v, setV] = useState<SelectionValue[]>(["a"]);
  return <CheckboxGroup label="Letters" options={["a", "b", { value: "c", label: "C", disabled: true }]} value={v} setResult={setV} />;
}

describe("CheckboxGroup / RadioGroup", () => {
  it("toggles native checkboxes", async () => {
    render(<Checks />);
    expect(screen.getByRole("group", { name: /Letters/ })).toBeInTheDocument();
    const b = screen.getByRole("checkbox", { name: "b" });
    await userEvent.click(b);
    expect(b).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "a" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "C" })).toBeDisabled();
  });

  it("radio emits a single value", async () => {
    const setResult = vi.fn();
    render(<RadioGroup label="Size" options={["S", "M"]} value="S" setResult={setResult} />);
    expect(screen.getByRole("radiogroup", { name: /Size/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "M" }));
    expect(setResult).toHaveBeenCalledWith("M");
  });
});

describe("Dropdown", () => {
  it("opens with keyboard, filters and selects (single)", async () => {
    const setResult = vi.fn();
    render(<Dropdown options={["Apple", "Banana", "Cherry"]} placeholder="Fruit" setResult={setResult} />);
    const combo = screen.getByRole("combobox", { name: "Fruit" });
    fireEvent.keyDown(combo, { key: "Enter" });
    expect(combo).toHaveAttribute("aria-expanded", "true");
    await userEvent.type(screen.getByLabelText("Search options"), "an");
    const opts = screen.getAllByRole("option");
    expect(opts.map((o) => o.textContent)).toEqual(["Banana"]);
    await userEvent.click(opts[0] as HTMLElement);
    expect(setResult).toHaveBeenCalledWith(["Banana"]);
    expect(combo).toHaveAttribute("aria-expanded", "false");
  });

  it("multi-select, clear and add new", async () => {
    const setResult = vi.fn();
    const setAdded = vi.fn();
    render(<Dropdown multiple addNew options={["A", "B"]} value={["A"]} setResult={setResult} setAddedOptions={setAdded} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(screen.getByLabelText("Add new option"), "C{enter}");
    expect(setAdded).toHaveBeenCalledWith(["A", "B", "C"]);
    await userEvent.click(screen.getByRole("button", { name: "Clear Selection" }));
    expect(setResult).toHaveBeenLastCalledWith([]);
  });

  it("SingleDropdown maps to a string value", async () => {
    const setResult = vi.fn();
    render(<SingleDropdown options={["x", "y"]} value="x" setResult={setResult} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("x");
    expect(screen.queryByText("1")).toBeNull();
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "y" }));
    expect(setResult).toHaveBeenCalledWith("y");
  });
});

describe("DropdownSimple", () => {
  it("renders menu items and selects by key", async () => {
    const onSelect = vi.fn();
    render(<DropdownSimple isOpen items={["One", { key: 2, value: "Two", box: ["new"] }]} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("menuitem", { name: /Two/ }));
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it("renders nothing when closed", () => {
    render(<DropdownSimple items={["One"]} />);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
