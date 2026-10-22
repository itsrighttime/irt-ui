import { render } from "@testing-library/react";
import { Icon } from "./Icon";
import { IconProvider } from "./IconProvider";
import { iconNames, iconRegistry, isIconName } from "./registry";
import { legacyIconAliases, resolveIconName } from "./legacyAliases";
import { renderIcon } from "./renderIcon";
import type { IconSvgProps } from "./types";

const Custom = (props: IconSvgProps) => <svg data-testid="custom" {...props} />;

describe("icon registry", () => {
  it("exposes typed semantic names", () => {
    expect(iconNames).toContain("close");
    expect(isIconName("close")).toBe(true);
    expect(isIconName("crossIcon")).toBe(false);
  });

  it("maps every legacy alias to a registry entry", () => {
    for (const target of Object.values(legacyIconAliases)) {
      expect(iconRegistry[target]).toBeDefined();
    }
    expect(resolveIconName("crossIcon")).toBe("close");
    expect(resolveIconName("nope")).toBeUndefined();
  });
});

describe("<Icon>", () => {
  it("renders a decorative svg by default", () => {
    const { container } = render(<Icon name="search" size={16} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "16");
  });

  it("is labelled when a label is given", () => {
    const { getByRole } = render(<Icon name="close" label="Close" />);
    expect(getByRole("img", { name: "Close" })).toBeInTheDocument();
  });

  it("accepts legacy names", () => {
    const { container } = render(<Icon name="crossIcon" />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("uses IconProvider overrides and defaults", () => {
    const { getByTestId } = render(
      <IconProvider icons={{ close: Custom }} strokeWidth={1.5}>
        <Icon name="close" />
      </IconProvider>,
    );
    expect(getByTestId("custom")).toHaveAttribute("stroke-width", "1.5");
  });

  it("supports an explicit component via `as`", () => {
    const { getByTestId } = render(<Icon as={Custom} />);
    expect(getByTestId("custom")).toBeInTheDocument();
  });

  it("renders nothing and warns for unknown names", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { container } = render(<Icon name={"doesNotExist" as "close"} />);
    expect(container.firstChild).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("doesNotExist"));
    warn.mockRestore();
  });

  it("renderIcon passes nodes through and resolves names", () => {
    const { container, getByTestId } = render(
      <>
        {renderIcon("plus")}
        {renderIcon(<span data-testid="node" />)}
      </>,
    );
    expect(container.querySelector("svg")).not.toBeNull();
    expect(getByTestId("node")).toBeInTheDocument();
  });
});
