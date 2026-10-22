import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";
import { Dialog, type DialogItem } from "./Dialog";

describe("Modal", () => {
  it("renders an accessible dialog and closes via Escape / overlay / button", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal isOpen onClose={onClose} ariaLabel="Edit">
        <input aria-label="name" />
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Edit" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByLabelText("name")).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(document.body.querySelector("[data-irt-animated]") as Element);
    expect(onClose).toHaveBeenCalledTimes(3);
    expect(container).toBeEmptyDOMElement();
  });

  it("does not close when clicking content", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose}>
        <p>body</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("body"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders nothing when closed", () => {
    render(
      <Modal isOpen={false} onClose={() => undefined}>
        <p>body</p>
      </Modal>,
    );
    expect(screen.queryByText("body")).toBeNull();
  });
});

describe("Dialog", () => {
  const items: DialogItem[] = [
    { key: "profile", icon: "user", component: <p>Profile panel</p> },
    { key: "security-settings", icon: "lock", component: <p>Security panel</p> },
  ];

  it("switches tabs (uncontrolled) and reports changes", async () => {
    const onActiveKeyChange = vi.fn();
    render(<Dialog isOpen onClose={() => undefined} title="Settings" items={items} onActiveKeyChange={onActiveKeyChange} />);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Profile panel")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Security settings" }));
    expect(screen.getByText("Security panel")).toBeInTheDocument();
    expect(onActiveKeyChange).toHaveBeenLastCalledWith("security-settings");
  });

  it("respects a controlled activeKey", () => {
    render(<Dialog isOpen onClose={() => undefined} title="S" items={items} activeKey="security-settings" />);
    expect(screen.getByText("Security panel")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Security settings" })).toHaveAttribute("aria-selected", "true");
  });
});
