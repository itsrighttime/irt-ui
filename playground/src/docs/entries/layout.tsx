import { useState } from "react";
import { Tabs } from "@itsrighttime/irt-ui/atoms";
import { Sidebar, TabBar, Workspace, type SidebarItem, type TabBarConfig, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const sidebar: SidebarItem[] = [
  {
    id: "crm",
    type: "group",
    title: "CRM",
    icon: "target",
    defaultOpen: true,
    children: [
      { id: "leads", type: "label", route: "/app/leads", text: "Leads", leftIcons: [{ icon: "inbox" }], tokens: [{ text: "12" }] },
      { id: "contacts", type: "label", route: "/app/contacts", text: "Contacts", leftIcons: [{ icon: "users" }] },
    ],
  },
  {
    id: "settings",
    type: "group",
    title: "Settings",
    icon: "settings",
    children: [
      { id: "profile", type: "label", route: "/app/settings/profile", text: "Profile", leftIcons: [{ icon: "user" }] },
      { id: "security", type: "label", route: "/app/settings/security", text: "Security", leftIcons: [{ icon: "lock" }] },
    ],
  },
];

const workspaceConfig: WorkspaceConfig = {
  topPrimary: {
    center: [
      { id: "dashboard", type: "text", text: "Dashboard", route: "/app/dashboard" },
      { id: "reports", type: "text", text: "Reports", route: "/app/reports" },
    ],
    end: [
      { id: "bell", type: "icon", icon: "bell", label: "Notifications" },
      {
        id: "account",
        type: "dropdown",
        trigger: { type: "icon", icon: "userCircle", label: "Account" },
        items: [
          { key: "profile", value: "Profile", icon: "user", route: "/app/settings/profile" },
          { key: "logout", value: "Log out", icon: "logout", danger: true },
        ],
      },
    ],
  },
  leftPrimary: {
    start: [
      { id: "home", type: "icon", icon: "home", label: "Home", route: "/app/dashboard" },
      { id: "leads-icon", type: "icon", icon: "target", label: "Leads", route: "/app/leads" },
    ],
    end: [{ id: "settings-icon", type: "icon", icon: "settings", label: "Settings", route: "/app/settings/profile" }],
  },
  leftSidebar: sidebar,
};

const workspaceControls: Control[] = [
  { type: "boolean", name: "leftSidebarOpen", default: true, group: "Sidebars" },
  { type: "text", name: "sidebarWidth", default: "220px", group: "Sidebars" },
  { type: "number", name: "overlayBreakpoint", default: 640, libDefault: 0, min: 0, max: 1200, step: 40, group: "Sidebars", hint: "Narrower than this → sidebar floats over content" },
  { type: "text", name: "barSize", default: "44px", group: "Bars" },
  { type: "boolean", name: "topPrimaryStart", default: true, group: "Bars", hint: "Brand slot before the first top tab" },
  { type: "text", name: "height", default: "420px", group: "Size" },
];

function WorkspaceDemo({ v }: { v: ControlValues }) {
  const [path, setPath] = useState("/app/leads");
  const [open, setOpen] = useState(true);
  const log = useLog();
  const sidebarOpen = Boolean(v.leftSidebarOpen) && open;
  return (
    <div className="pg-frame">
      <Workspace
        config={workspaceConfig}
        currentPath={path}
        onNavigate={(route, payload) => {
          setPath(route);
          log("onNavigate", { route, id: payload.id });
        }}
        onAction={(payload) => log("onAction", payload)}
        topPrimaryStart={v.topPrimaryStart ? <strong className="pg-ws-brand">Acme</strong> : undefined}
        leftSidebarOpen={sidebarOpen}
        onSidebarOpenChange={(side, next) => {
          setOpen(next);
          log("onSidebarOpenChange", { side, open: next });
        }}
        overlayBreakpoint={Number(v.overlayBreakpoint)}
        sidebarWidth={String(v.sidebarWidth)}
        barSize={String(v.barSize)}
        height={String(v.height)}
        width="100%"
        contentStyle={{ padding: 24 }}
      >
        <div className="pg-stack">
          <span className="pg-eyebrow">Current route</span>
          <code>{path}</code>
          {!open && (
            <button type="button" className="pg-link-button" onClick={() => setOpen(true)}>
              Re-open the sidebar
            </button>
          )}
        </div>
      </Workspace>
    </div>
  );
}

const barConfig: TabBarConfig = {
  start: [
    { id: "overview", type: "text", text: "Overview", route: "/overview" },
    { id: "activity", type: "text", text: "Activity", route: "/activity" },
    { id: "archived", type: "text", text: "Archived", disabled: true },
  ],
  center: [
    {
      id: "label",
      type: "label",
      text: "Release 1.2",
      leftIcons: [{ icon: "target" }],
      tokens: [{ text: "beta", background: "var(--irt-color-warning)", color: "var(--irt-color-on-warning)" }],
    },
  ],
  end: [
    { id: "bell", type: "icon", icon: "bell", label: "Notifications", route: "/notifications" },
    {
      id: "more",
      type: "dropdown",
      trigger: { type: "icon", icon: "moreHorizontal", label: "More" },
      items: [
        { key: "export", value: "Export", icon: "download" },
        { key: "share", value: "Share", icon: "share" },
      ],
    },
  ],
};

function TabBarDemo() {
  const [route, setRoute] = useState("/overview");
  const log = useLog();
  return (
    <div className="pg-frame" style={{ height: 48 }}>
      <TabBar
        config={barConfig}
        isRouteActive={(r) => r === route}
        onAction={(payload) => {
          log("onAction", payload);
          if (payload.route) setRoute(payload.route);
        }}
      />
    </div>
  );
}

const sidebarControls: Control[] = [
  { type: "text", name: "ariaLabel", default: "Sidebar", libDefault: "Sidebar", group: "Accessibility" },
  { type: "text", name: "width", default: "240px", group: "Appearance" },
];

function SidebarDemo({ v }: { v: ControlValues }) {
  const [route, setRoute] = useState("/app/leads");
  const log = useLog();
  return (
    <div className="pg-frame" style={{ width: String(v.width), height: 300 }}>
      <Sidebar
        config={sidebar}
        position="leftSidebar"
        ariaLabel={String(v.ariaLabel)}
        isRouteActive={(r) => r === route}
        onAction={(payload) => {
          log("onAction", payload);
          if (payload.route) setRoute(payload.route);
        }}
      />
    </div>
  );
}

const tabsControls: Control[] = [
  { type: "select", name: "variant", default: "underline", options: ["underline", "pills", "enclosed"], group: "Appearance" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium"], group: "Appearance" },
  { type: "boolean", name: "fitted", default: false, group: "Appearance", hint: "Tabs share the full width" },
  { type: "boolean", name: "icons", default: true, group: "Content" },
  { type: "boolean", name: "badges", default: true, group: "Content" },
  { type: "boolean", name: "disableLast", label: "disable last tab", default: true, group: "State" },
  { type: "boolean", name: "keepMounted", default: false, group: "Behavior", hint: "Keep hidden panels mounted" },
];

function TabsDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <div style={{ width: "min(560px, 100%)" }}>
      <Tabs
        ariaLabel="Project sections"
        variant={v.variant as "underline"}
        size={v.size as "medium"}
        fitted={Boolean(v.fitted)}
        keepMounted={Boolean(v.keepMounted)}
        onChange={(key) => log("onChange", key)}
        items={[
          { key: "overview", label: "Overview", icon: v.icons ? "home" : undefined, content: <p>Project summary, owners and milestones.</p> },
          {
            key: "issues",
            label: "Issues",
            icon: v.icons ? "alertCircle" : undefined,
            badge: v.badges ? 8 : undefined,
            content: <p>Open and closed issues.</p>,
          },
          { key: "members", label: "Members", icon: v.icons ? "users" : undefined, badge: v.badges ? 3 : undefined, content: <p>People with access.</p> },
          { key: "settings", label: "Settings", icon: v.icons ? "settings" : undefined, content: <p>Danger zone.</p>, disabled: Boolean(v.disableLast) },
        ]}
      />
    </div>
  );
}

export const layoutEntries: DocEntry[] = [
  {
    id: "workspace",
    title: "Workspace",
    group: "Layout",
    description:
      "Application shell with ten slots (top/bottom/left/right primary & secondary bars plus two sidebars). Router- and auth-agnostic: pass `currentPath`, `onNavigate` and your page as `children`. Sizes are props (`barSize`, `sidebarWidth`); sidebars can be toggled and float as drawers below `overlayBreakpoint`. Includes a skip link. This playground itself is built with it.",
    imports: 'import { Workspace, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";',
    controls: workspaceControls,
    notes: (
      <p>
        Every config field — slots, tab types, sidebar items, routing, visibility, validation and recipes — is covered in the{" "}
        <a href="#/guides/workspace">Workspace configuration guide</a>.
      </p>
    ),
    align: "stretch",
    render: (v) => <WorkspaceDemo v={v} />,
    code: (v) =>
      [
        '"use client";',
        'import { usePathname, useRouter } from "next/navigation";',
        "",
        "export function Shell({ children }: { children: React.ReactNode }) {",
        "  const router = useRouter();",
        "  const [navOpen, setNavOpen] = useState(true);",
        "  return (",
        jsx(
          "Workspace",
          [
            ["config", "{config}"],
            ["currentPath", "{usePathname()}"],
            ["onNavigate", "{(route) => router.push(route)}"],
            ["leftSidebarOpen", "{navOpen}"],
            ["onSidebarOpenChange", "{(_, open) => setNavOpen(open)}"],
            ...changed(workspaceControls, v, ["sidebarWidth", "overlayBreakpoint", "barSize"]),
          ],
          "{children}",
          "    ",
        ),
        "  );",
        "}",
      ].join("\n"),
  },
  {
    id: "tab-bar",
    title: "TabBar",
    group: "Layout",
    description:
      "A toolbar with start / center / end sections of text, label, icon, dropdown and custom tabs (←/→ move focus). Active tabs get a tinted background. Vertical bars accept icon tabs only.",
    imports: 'import { TabBar, type TabBarConfig } from "@itsrighttime/irt-ui/layout";',
    align: "stretch",
    render: () => <TabBarDemo />,
    code: () =>
      [
        "const config: TabBarConfig = {",
        '  start: [{ id: "overview", type: "text", text: "Overview", route: "/overview" }],',
        '  center: [{ id: "release", type: "label", text: "Release 1.2", tokens: [{ text: "beta" }] }],',
        '  end: [{ id: "bell", type: "icon", icon: "bell", label: "Notifications" }],',
        "};",
        "",
        "<TabBar config={config} onAction={handle} />",
      ].join("\n"),
  },
  {
    id: "sidebar",
    title: "Sidebar",
    group: "Layout",
    description: "Nested, collapsible navigation (`<nav>`) with group icons, item icons, token badges and an active indicator. Groups toggle with Enter/Space.",
    imports: 'import { Sidebar, type SidebarItem } from "@itsrighttime/irt-ui/layout";',
    controls: sidebarControls,
    render: (v) => <SidebarDemo v={v} />,
    code: (v) => jsx("Sidebar", [["config", "{items}"], ["position", "leftSidebar"], ...changed(sidebarControls, v, ["ariaLabel"]), ["onAction", "{handle}"]]),
  },
  {
    id: "tabs",
    title: "Tabs",
    group: "Layout",
    description:
      "Content tabs (WAI-ARIA tabs pattern): underline, pills or enclosed (segmented) variants, icons, count badges, disabled tabs, controlled or uncontrolled. Without `content` it is a plain tab strip / segmented control.",
    imports: 'import { Tabs, type TabItem } from "@itsrighttime/irt-ui";',
    controls: tabsControls,
    render: (v) => <TabsDemo v={v} />,
    code: (v) =>
      jsx("Tabs", [
        ["ariaLabel", "Project sections"],
        ...changed(tabsControls, v, ["variant", "size", "fitted", "keepMounted"]),
        ["items", "{items}"],
        ["onChange", "{setSection}"],
      ]),
    examples: [
      {
        title: "Segmented control",
        description: "`variant=\"enclosed\"` without panels, controlled with `value`.",
        render: () => (
          <Tabs
            variant="enclosed"
            ariaLabel="Range"
            defaultValue="week"
            items={[
              { key: "day", label: "Day" },
              { key: "week", label: "Week" },
              { key: "month", label: "Month" },
            ]}
          />
        ),
        code: '<Tabs variant="enclosed" ariaLabel="Range" value={range} onChange={setRange}\n  items={[{ key: "day", label: "Day" }, { key: "week", label: "Week" }, { key: "month", label: "Month" }]} />',
      },
      {
        title: "Pills with counts",
        render: () => (
          <Tabs
            variant="pills"
            size="small"
            ariaLabel="Inbox"
            items={[
              { key: "all", label: "All", badge: 24 },
              { key: "unread", label: "Unread", badge: 3 },
              { key: "flagged", label: "Flagged" },
            ]}
          />
        ),
        code: '<Tabs variant="pills" size="small" items={[{ key: "all", label: "All", badge: 24 }, …]} />',
      },
    ],
  },
];

