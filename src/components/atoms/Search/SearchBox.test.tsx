import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBox } from "./SearchBox";

const suggestions = [
  { code: 1, name: "Mumbai" },
  { code: 2, name: "Mysuru" },
  { code: 3, name: "Delhi" },
];

describe("SearchBox", () => {
  it("shows suggestions after minChars and selects with keyboard", async () => {
    const setResult = vi.fn();
    render(<SearchBox suggestions={suggestions} setResult={setResult} minChars={2} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "My");
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(setResult).toHaveBeenCalledWith(2);
    expect(input).toHaveValue("Mysuru");
  });

  it("uses unique ids per instance", async () => {
    render(
      <>
        <SearchBox suggestions={suggestions} setResult={() => undefined} minChars={1} ariaLabel="a" />
        <SearchBox suggestions={suggestions} setResult={() => undefined} minChars={1} ariaLabel="b" />
      </>,
    );
    await userEvent.type(screen.getByRole("combobox", { name: "a" }), "m");
    await userEvent.type(screen.getByRole("combobox", { name: "b" }), "m");
    const ids = screen.getAllByRole("option").map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("shows an empty state", async () => {
    render(<SearchBox suggestions={suggestions} setResult={() => undefined} />);
    await userEvent.type(screen.getByRole("combobox"), "xyz");
    expect(screen.getByText("No suggestions")).toBeInTheDocument();
  });
});
