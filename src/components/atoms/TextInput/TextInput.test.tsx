import { createRef, useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextInput } from "./TextInput";
import { EmailInput } from "./EmailInput";
import { MobileInput } from "./MobileInput";
import { PasswordInput } from "./PasswordInput";
import { NumberInput } from "./NumberInput";
import { UrlInput, googleFaviconResolver, parseUrlDomain } from "./UrlInput";
import { TextArea } from "./TextArea";
import { JsonField } from "./JsonField";
import { AddressInput, type AddressValue } from "./AddressInput";

function Controlled() {
  const [v, setV] = useState("");
  return <TextInput label="Name" value={v} setResult={setV} />;
}

describe("TextInput", () => {
  it("floats the label once a value exists and emits setResult", async () => {
    render(<Controlled />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("placeholder", "Name");
    await userEvent.type(input, "Ada");
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(input).toHaveValue("Ada");
  });

  it("uses placeholder when there is no label (bug fix)", () => {
    render(<TextInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls both onChange and setResult", () => {
    const onChange = vi.fn();
    const setResult = vi.fn();
    render(<TextInput ariaLabel="x" onChange={onChange} setResult={setResult} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });
    expect(onChange).toHaveBeenCalled();
    expect(setResult).toHaveBeenCalledWith("a");
  });

  it("links error text and marks invalid", () => {
    render(<TextInput label="Email" error="Required" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput ref={ref} ariaLabel="r" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe("presets", () => {
  it("EmailInput uses type=email", () => {
    render(<EmailInput ariaLabel="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("MobileInput strips invalid characters", () => {
    const setResult = vi.fn();
    render(<MobileInput ariaLabel="m" setResult={setResult} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "+91 98-76a" } });
    expect(setResult).toHaveBeenCalledWith("+919876");
  });

  it("PasswordInput toggles visibility", async () => {
    const { container } = render(<PasswordInput ariaLabel="pw" />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("password");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(input.type).toBe("text");
  });

  it("NumberInput uses type=number without card autocomplete", () => {
    render(<NumberInput ariaLabel="n" />);
    const input = screen.getByRole("spinbutton");
    expect(input).not.toHaveAttribute("autocomplete", "cc-number");
  });
});

describe("UrlInput", () => {
  it("validates and does not call external services by default", () => {
    const { container } = render(<UrlInput ariaLabel="url" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "not a url" } });
    expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "example.com" } });
    expect(screen.queryByText("Invalid URL")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("shows a favicon with an opt-in resolver and honours value", () => {
    const { container } = render(<UrlInput ariaLabel="url" value="example.com" faviconResolver={googleFaviconResolver} />);
    expect(container.querySelector("img")?.getAttribute("src")).toContain("example.com");
    expect(parseUrlDomain("https://a.b/c")).toBe("a.b");
  });
});

describe("TextArea", () => {
  it("emits on blur and enforces maxLength", () => {
    const setResult = vi.fn();
    render(<TextArea label="Bio" maxLength={3} setResult={setResult} showCharacterCount />);
    const ta = screen.getByRole("textbox", { name: "Bio" });
    fireEvent.change(ta, { target: { value: "abc" } });
    fireEvent.change(ta, { target: { value: "abcd" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Maximum length is 3");
    fireEvent.blur(ta);
    expect(setResult).toHaveBeenCalledWith("abc");
    expect(screen.getByText(/Char: 3/)).toBeInTheDocument();
  });
});

describe("JsonField", () => {
  it("formats valid JSON and reports invalid JSON", async () => {
    const setResult = vi.fn();
    const setValid = vi.fn();
    render(<JsonField value="{bad" setResult={setResult} setIsFieldValid={setValid} />);
    await userEvent.click(screen.getByRole("button", { name: "Validate & Save" }));
    expect(screen.getByText("Invalid JSON format")).toBeInTheDocument();
    expect(setValid).toHaveBeenLastCalledWith(false);
  });

  it("emits pretty JSON", async () => {
    const setResult = vi.fn();
    render(<JsonField value='{"a":1}' setResult={setResult} setIsFieldValid={() => undefined} />);
    await userEvent.click(screen.getByRole("button", { name: "Validate & Save" }));
    expect(setResult).toHaveBeenCalledWith('{\n  "a": 1\n}');
  });
});

describe("AddressInput", () => {
  it("renders enabled fields and merges updates", () => {
    const setResult = vi.fn<(v: AddressValue) => void>();
    render(<AddressInput isCity isPostal value={{ city: "Pune" }} setResult={setResult} />);
    fireEvent.change(screen.getByPlaceholderText("Postal Code"), { target: { value: "411001" } });
    expect(setResult).toHaveBeenCalledWith({ city: "Pune", postal: "411001" });
  });
});
