import { useState } from "react";
import { Sidebar, TabBar, Workspace, type SidebarItem, type TabBarConfig, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";
import type { DocEntry } from "../types";

const sidebar: SidebarItem[] = [
  {
    id: "crm",
    type: "group",
    title: "CRM",
    defaultOpen: true,
    children: [
      { id: "leads", type: "label", route: "/app/leads", text: "Leads", tokens: [{ text: "12", background: "var(--irt-color-primary)", color: "var(--irt-color-on-primary)" }] },
      { id: "contacts", type: "label", route: "/app/contacts", text: "Contacts" },
    ],
  },
  {
    id: "settings",
    type: "group",
    title: "Settings",
    children: [
      { id: "profile", type: "label", route: "/app/settings/profile", text: "Profile", leftIcons: [{ icon: "user" }] },
      { id: "security", type: "label", route: "/app/settings/security", text: "Security", leftIcons: [{ icon: "lock" }] },
    ],
  },
];

const config: WorkspaceConfig = {
  topPrimary: {
    center: [{ id: "search", type: "text", text: "Dashboard", route: "/app" }],
    end: [
      {
        id: "account",
        type: "dropdown",
        trigger: { type: "icon", icon: "userCircle", label: "Account" },
        items: [
          { key: "profile", value: "Profile", route: "/app/settings/profile" },
          { key: "logout", value: "Log out" },
        ],
      },
    ],
  },
  leftPrimary: {
    start: [
      { id: "home", type: "icon", icon: "home", label: "Home", route: "/app" },
      { id: "leads-icon", type: "icon", icon: "target", label: "Leads", route: "/app/leads" },
    ],
    end: [{ id: "settings-icon", type: "icon", icon: "settings", label: "Settings", route: "/app/settings/profile" }],
  },
  leftSidebar: sidebar,
};

function WorkspaceDemo() {
  const [path, setPath] = useState("/app/leads");
  const [last, setLast] = useState("");
  return (
    <div className="pg-stack" style={{ width: "100%" }}>
      <div className="pg-frame">
        <Workspace
          config={config}
          currentPath={path}
          onNavigate={(route) => setPath(route)}
          onAction={(p) => setLast(JSON.stringify(p))}
          topPrimaryStart={<strong style={{ padding: "0 8px" }}>Acme</strong>}
          height="380px"
          width="100%"
        >
          <div style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Current route</h3>
            <code>{path}</code>
          </div>
        </Workspace>
      </div>
      <small className="pg-muted">last action: {last || "—"}</small>
    </div>
  );
}

const barConfig: TabBarConfig = {
  start: [{ id: "overview", type: "text", text: "Overview", route: "/overview" }],
  center: [
    { id: "label", type: "label", text: "Release 1.2", leftIcons: [{ icon: "target" }], tokens: [{ text: "beta", background: "var(--irt-color-warning)", color: "var(--irt-color-on-warning)" }] },
  ],
  end: [
    { id: "bell", type: "icon", icon: "bell", label: "Notifications" },
    { id: "settings", type: "icon", icon: "settings", label: "Settings" },
  ],
};

export const layoutEntries: DocEntry[] = [
  {
    id: "workspace",
    title: "Workspace",
    group: "Layout",
    description:
      "Application shell with ten slots (top/bottom/left/right primary & secondary bars plus two sidebars). Router- and auth-agnostic: pass `currentPath`, `onNavigate` and your page as `children`. This playground itself is built with it.",
    imports: 'import { Workspace, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";',
    props: [
      { name: "config", type: "WorkspaceConfig", description: "Tabs per slot: `{ topPrimary: { start, center, end }, leftSidebar: [...] }`" },
      { name: "currentPath", type: "string", description: "Highlights active tabs (e.g. `usePathname()`)" },
      { name: "onNavigate", type: "(route, payload) => void", description: "Called for tabs with a `route` (e.g. `router.push`)" },
      { name: "onAction", type: "(payload) => void", description: "Every activation, with or without route" },
      { name: "visibility", type: "WorkspaceVisibility", description: "Context-aware tab visibility rules" },
      { name: "topPrimaryStart", type: "ReactNode", description: "Content before the first top tab" },
    ],
    render: () => <WorkspaceDemo />,
    code: () =>
      [
        '"use client";',
        'import { usePathname, useRouter } from "next/navigation";',
        "",
        "export function Shell({ children }: { children: React.ReactNode }) {",
        "  const router = useRouter();",
        "  return (",
        "    <Workspace config={config} currentPath={usePathname()} onNavigate={(route) => router.push(route)}>",
        "      {children}",
        "    </Workspace>",
        "  );",
        "}",
      ].join("\n"),
  },
  {
    id: "tab-bar",
    title: "TabBar",
    group: "Layout",
    description: "A bar with start / center / end sections of text, label, icon, dropdown and custom tabs. Vertical bars accept icon tabs only.",
    imports: 'import { TabBar, type TabBarConfig } from "@itsrighttime/irt-ui/layout";',
    render: () => (
      <div className="pg-frame" style={{ height: 44 }}>
        <TabBar config={barConfig} isRouteActive={(r) => r === "/overview"} />
      </div>
    ),
    code: () => '<TabBar config={{ start: [{ id: "overview", type: "text", text: "Overview", route: "/overview" }] }} onAction={handle} />',
  },
  {
    id: "sidebar",
    title: "Sidebar",
    group: "Layout",
    description: "Nested, collapsible navigation with icons and token badges.",
    imports: 'import { Sidebar, type SidebarItem } from "@itsrighttime/irt-ui/layout";',
    render: () => (
      <div className="pg-frame" style={{ width: 240, height: 260 }}>
        <Sidebar config={sidebar} position="leftSidebar" isRouteActive={(r) => r === "/app/leads"} />
      </div>
    ),
    code: () => '<Sidebar config={items} position="leftSidebar" onAction={handle} />',
  },
];
