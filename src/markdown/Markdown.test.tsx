import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "./MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders headings, links, GFM tables and inline code", () => {
    render(<MarkdownRenderer content={"# Title\n\nSee [docs](https://x.dev) and `code`.\n\n| a | b |\n|---|---|\n| **1** | 2 |\n"} />);
    expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "docs" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("1").tagName).toBe("STRONG");
    expect(screen.getByText("code").tagName).toBe("CODE");
  });

  it("does not render raw HTML", () => {
    const { container } = render(<MarkdownRenderer content={'<img src=x onerror="alert(1)">'} />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("shows fenced code (fallback until the highlighter loads)", async () => {
    render(<MarkdownRenderer content={"```ts\nconst a = 1;\n```"} />);
    expect(await screen.findByText(/const a = 1;/)).toBeInTheDocument();
  });
});
