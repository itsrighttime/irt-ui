import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Workspace } from "./layout/Workspace";
import { matchRoute } from "./routing";
import { validateWorkspaceConfig } from "./layout/validateWorkspaceConfig.helper";
import { filterWorkspace } from "./config/filterWorkspace";
import type { WorkspaceConfig } from "./layout/layout.types";

const config: WorkspaceConfig = {
  topPrimary: { end: [{ type: "icon", icon: "logoutIcon", label: "Log Out", id: "logout" }] },
  leftPrimary: {
    start: [
      { type: "icon", icon: "home", label: "Home", id: "home", route: "/workspace" },
      { type: "icon", icon: "fileText", label: "Documents", id: "documents", route: "/workspace/documents" },
    ],
  },
  leftSidebar: [
    {
      id: "users",
      type: "group",
      title: "User Management",
      defaultOpen: true,
      children: [
        { type: "label", id: "user/list", route: "user/list", text: "Accounts" },
        { type: "label", id: "user/create", route: "user/create", text: "Create Account" },
      ],
    },
  ],
};

describe("matchRoute", () => {
  it("matches absolute and relative routes", () => {
    expect(matchRoute("/workspace/documents", "/workspace/documents/12")).toBe(true);
    expect(matchRoute("/workspace/documents", "/workspace/lead")).toBe(false);
    expect(matchRoute("user/list", "/workspace/user/list")).toBe(true);
    expect(matchRoute("user/list", "/app/v2/user/list", "/app/v2")).toBe(true);
    expect(matchRoute("/workspace/", "/workspace")).toBe(true);
    expect(matchRoute("/workspace/", "/workspace/user/list")).toBe(false);
    expect(matchRoute(undefined, "/x")).toBe(false);
    expect(matchRoute("a", undefined)).toBe(false);
  });
});

describe("validateWorkspaceConfig / filterWorkspace", () => {
  it("rejects text tabs in vertical slots", () => {
    const errors = validateWorkspaceConfig({ leftPrimary: { start: [{ type: "text", id: "t", text: "T" }] } });
    expect(errors).toEqual([{ slot: "leftPrimary", tabId: "t", message: "TEXT tabs are not allowed in vertical slots" }]);
  });

  it("filters by visible ids and keeps groups with visible children", () => {
    const out = filterWorkspace(config, new Set(["home", "user/list"]));
    expect(out.leftPrimary?.start?.map((t) => t.id)).toEqual(["home"]);
    expect(out.leftSidebar).toHaveLength(1);
  });
});

describe("Workspace", () => {
  it("renders children, bars and sidebar, and highlights the active route", () => {
    render(
      <Workspace config={config} currentPath="/workspace/user/list" topPrimaryStart={<span>Ada Lovelace</span>}>
        <p>Page content</p>
      </Workspace>,
    );
    expect(within(screen.getByRole("main")).getByText("Page content")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log Out" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Sidebar" });
    expect(within(nav).getByRole("link", { name: /Accounts/ })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: /Create Account/ })).not.toHaveAttribute("aria-current");
  });

  it("navigates via onNavigate and reports actions without routes", async () => {
    const onNavigate = vi.fn();
    const onAction = vi.fn();
    render(<Workspace config={config} onNavigate={onNavigate} onAction={onAction} currentPath="/workspace" />);
    await userEvent.click(screen.getByRole("button", { name: "Documents" }));
    expect(onNavigate).toHaveBeenCalledWith("/workspace/documents", { route: "/workspace/documents", id: "documents" });
    await userEvent.click(screen.getByRole("button", { name: "Log Out" }));
    expect(onAction).toHaveBeenLastCalledWith({ key: "logout", id: "logout" });
  });

  it("collapses sidebar groups", async () => {
    render(<Workspace config={config} />);
    const header = screen.getByRole("button", { name: /User Management/ });
    expect(header).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Accounts")).toBeNull();
  });

  it("applies visibility rules", async () => {
    render(
      <Workspace
        config={config}
        visibility={{ alwaysVisible: ["home", "documents", "logout"], map: { home: [], documents: ["users", "user/list"] }, initialTab: "home" }}
      />,
    );
    expect(screen.queryByRole("navigation")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Documents" }));
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.queryByText("Create Account")).toBeNull();
  });

  it("throws on invalid config", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Workspace config={{ rightPrimary: { start: [{ type: "label", id: "x", text: "x" }] } }} />)).toThrow(
      "Invalid Workspace Config",
    );
    err.mockRestore();
  });
});
