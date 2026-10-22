import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { PlainButton } from "./PlainButton";
import { ThemeProvider } from "../../../theme/ThemeProvider";

describe("Button", () => {
  it("renders a type=button with label and default variant/size", () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.className).toMatch(/primary/);
    expect(btn.className).toMatch(/medium/);
  });

  it("fires onClick and blocks it when disabled or loading", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(<Button onClick={onClick} disabled>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    rerender(<Button onClick={onClick} loading>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards refs and supports `as`", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button as="a" href="/x" ref={ref} variant="secondary">
        Link
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/x");
    expect(screen.getByRole("link")).not.toHaveAttribute("type");
  });

  it("renders registry icons by name and labels icon-only buttons", () => {
    const { container } = render(<Button iconLeft="plus" iconOnly ariaLabel="Add" />);
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("applies theme component defaults", () => {
    render(
      <ThemeProvider theme={{ components: { button: { variant: "ghost", size: "large" } } }}>
        <Button>Themed</Button>
      </ThemeProvider>,
    );
    const btn = screen.getByRole("button", { name: "Themed" });
    expect(btn.className).toMatch(/ghost/);
    expect(btn.className).toMatch(/large/);
  });

  it("props override theme defaults and style overrides last", () => {
    render(
      <Button variant="destructive" color="red" style={{ color: "blue" }}>
        X
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/destructive/);
    expect(btn.style.getPropertyValue("--irt-c-button-color")).toBe("red");
    expect(btn.style.color).toBe("blue");
  });
});

describe("IconButton", () => {
  it("uses the label as accessible name", () => {
    render(<IconButton icon="close" label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<IconButton icon="close" label="Close" onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders image URLs as <img>", () => {
    const { container } = render(<IconButton icon="https://example.com/a.png" label="A" />);
    expect(container.querySelector("img")).toHaveAttribute("src", "https://example.com/a.png");
  });
});

describe("PlainButton", () => {
  it("renders children over text", () => {
    render(<PlainButton text="old">new</PlainButton>);
    expect(screen.getByRole("button", { name: "new" })).toBeInTheDocument();
  });
});
