import { render, screen } from "@testing-library/react";
import { Loading } from "./Loading";
import { LoadingBorder } from "./LoadingBorder";
import { LoadingChat } from "./LoadingChat";
import DefaultLoadingBorder from "./LoadingBorder";

describe("Loading", () => {
  it.each(["CubesLoader", "FoldingLoader", "BounceLoader", "PulseLoader", "LoadingChat"] as const)(
    "renders %s as a status",
    (type) => {
      render(<Loading type={type} showText text="Fetching" />);
      expect(screen.getByRole("status", { name: "Fetching" })).toBeInTheDocument();
      expect(screen.getByText("Fetching")).toBeInTheDocument();
    },
  );

  it("LoadingBorder is a named and default export", () => {
    expect(DefaultLoadingBorder).toBe(LoadingBorder);
    const { container } = render(<LoadingBorder loading>child</LoadingBorder>);
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("LoadingChat instances use unique filter ids", () => {
    const { container } = render(
      <>
        <LoadingChat />
        <LoadingChat />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("filter")).map((f) => f.id);
    expect(new Set(ids).size).toBe(2);
  });
});
