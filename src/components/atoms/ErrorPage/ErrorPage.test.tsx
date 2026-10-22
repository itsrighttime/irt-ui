import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorPage } from "./ErrorPage";
import { IconError } from "./IconError";

describe("ErrorPage", () => {
  it("renders title and a plain link for string targets", () => {
    render(<ErrorPage statusCode={403} handleNavigate="/home" />);
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home Page" })).toHaveAttribute("href", "/home");
  });

  it("uses onNavigate for client-side navigation", async () => {
    const onNavigate = vi.fn();
    render(<ErrorPage handleNavigate="/home" onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("link"));
    expect(onNavigate).toHaveBeenCalledWith("/home");
  });

  it("calls a click handler", async () => {
    const onClick = vi.fn();
    render(<ErrorPage statusCode="500" handleNavigate={onClick} navigateTo="Dashboard" />);
    expect(screen.getByText("Server Error")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Dashboard" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("IconError exposes its message", () => {
    render(<IconError icon="imageOff" message="No image" />);
    expect(screen.getByRole("img", { name: "No image" })).toBeInTheDocument();
  });
});
