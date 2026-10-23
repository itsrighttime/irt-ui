import { useMemo, useState, type ReactNode } from "react";
import { Badge, Button, Switch, Tabs, TextInput } from "@itsrighttime/irt-ui/atoms";
import {
  matchRoute,
  useWorkspaceRoute,
  validateWorkspaceConfig,
  Workspace,
  type BarTabs,
  type SidebarItem,
  type TabConfig,
  type WorkspaceConfig,
  type WorkspaceVisibility,
} from "@itsrighttime/irt-ui/layout";
import { useLog, EventsProvider, useEvents } from "../state/events";
import { CodeBlock } from "../ui/CodeBlock";
import { Inline } from "../ui/Inline";
import { PropsTable } from "../ui/PropsTable";

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                       */
/* -------------------------------------------------------------------------- */

interface Field {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

function FieldTable({ fields }: { fields: Field[] }) {
  return (
    <div className="pg-table-wrap">
      <table className="pg-props">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.name}>
              <td className="pg-prop-name">
                <code>{f.name}</code>
                {f.required && (
                  <Badge size="small" tone="danger" variant="outline">
                    required
                  </Badge>
                )}
              </td>
              <td className="pg-prop-type">
                <code style={f.type.length <= 14 ? { whiteSpace: "nowrap" } : undefined}>{f.type}</code>
              </td>
              <td>
                <Inline text={f.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="pg-guide-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      {lead && (
        <p className="pg-lead">
          <Inline text={lead} />
        </p>
      )}
      {children}
    </section>
  );
}

function Frame({ children, height = 360 }: { children: ReactNode; height?: number }) {
  return (
    <div className="pg-frame pg-guide-frame" style={{ height }}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 1. Slot explorer                                                            */
/* -------------------------------------------------------------------------- */

const BAR_SLOTS = [
  "topPrimary",
  "topSecondary",
  "bottomSecondary",
  "bottomPrimary",
  "leftPrimary",
  "leftSecondary",
  "rightSecondary",
  "rightPrimary",
] as const;
type BarSlot = (typeof BAR_SLOTS)[number];
const SIDEBAR_SLOTS = ["leftSidebar", "rightSidebar"] as const;
type SidebarSlot = (typeof SIDEBAR_SLOTS)[number];
type Slot = BarSlot | SidebarSlot;

const VERTICAL: ReadonlySet<string> = new Set(["leftPrimary", "leftSecondary", "rightPrimary", "rightSecondary"]);

const barFor = (slot: BarSlot): BarTabs =>
  VERTICAL.has(slot)
    ? {
        start: [{ id: `${slot}-a`, type: "icon", icon: "home", label: `${slot} · start` }],
        end: [{ id: `${slot}-b`, type: "icon", icon: "settings", label: `${slot} · end` }],
      }
    : {
        start: [{ id: `${slot}-label`, type: "label", text: slot, tokens: [{ text: "start" }] }],
        center: [{ id: `${slot}-center`, type: "text", text: "center" }],
        end: [{ id: `${slot}-icon`, type: "icon", icon: "bell", label: `${slot} · end` }],
      };

const sidebarFor = (slot: SidebarSlot): SidebarItem[] => [
  {
    id: `${slot}-group`,
    type: "group",
    title: slot,
    defaultOpen: true,
    collapsible: false,
    children: [
      { id: `${slot}-one`, type: "label", text: "Item one", leftIcons: [{ icon: "fileText" }] },
      { id: `${slot}-two`, type: "label", text: "Item two", leftIcons: [{ icon: "folder" }] },
    ],
  },
];

/** Prints a config object as readable TypeScript (keys unquoted, short arrays inline). */
function printValue(value: unknown, indent = ""): string {
  const next = `${indent}  `;
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((v) => printValue(v, next));
    const inline = `[${items.join(", ")}]`;
    return inline.length < 110 && !inline.includes("\n") ? inline : `[\n${items.map((i) => `${next}${i}`).join(",\n")},\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    const parts = entries.map(([k, v]) => `${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${printValue(v, next)}`);
    const inline = `{ ${parts.join(", ")} }`;
    return inline.length < 110 && !inline.includes("\n") ? inline : `{\n${parts.map((p) => `${next}${p}`).join(",\n")},\n${indent}}`;
  }
  return JSON.stringify(value);
}

function SlotExplorer() {
  const [enabled, setEnabled] = useState<Record<Slot, boolean>>({
    topPrimary: true,
    topSecondary: false,
    bottomSecondary: false,
    bottomPrimary: false,
    leftPrimary: true,
    leftSecondary: false,
    rightSecondary: false,
    rightPrimary: false,
    leftSidebar: true,
    rightSidebar: false,
  });

  const config = useMemo<WorkspaceConfig>(() => {
    const out: WorkspaceConfig = {};
    for (const slot of BAR_SLOTS) if (enabled[slot]) out[slot] = barFor(slot);
    for (const slot of SIDEBAR_SLOTS) if (enabled[slot]) out[slot] = sidebarFor(slot);
    return out;
  }, [enabled]);

  const toggle = (slot: Slot) => (on: boolean) => setEnabled((s) => ({ ...s, [slot]: on }));

  return (
    <div className="pg-guide-split">
      <div className="pg-guide-toggles">
        <span className="pg-control-label">Bars (horizontal)</span>
        {(["topPrimary", "topSecondary", "bottomSecondary", "bottomPrimary"] as const).map((slot) => (
          <Switch key={slot} label={slot} value={enabled[slot]} setResult={toggle(slot)} size="small" spread width="100%" />
        ))}
        <span className="pg-control-label">Bars (vertical — icon tabs only)</span>
        {(["leftPrimary", "leftSecondary", "rightSecondary", "rightPrimary"] as const).map((slot) => (
          <Switch key={slot} label={slot} value={enabled[slot]} setResult={toggle(slot)} size="small" spread width="100%" />
        ))}
        <span className="pg-control-label">Sidebars</span>
        {SIDEBAR_SLOTS.map((slot) => (
          <Switch key={slot} label={slot} value={enabled[slot]} setResult={toggle(slot)} size="small" spread width="100%" />
        ))}
      </div>
      <div className="pg-stack" style={{ minWidth: 0 }}>
        <Frame height={380}>
          <Workspace config={config} height="100%" width="100%" barSize="40px" sidebarWidth="170px" skipLinkLabel={false}>
            <div className="pg-guide-content">
              <strong>children</strong>
              <span className="pg-muted">Your page renders here, in a scrollable &lt;main&gt;.</span>
            </div>
          </Workspace>
        </Frame>
        <div className="pg-guide-scroll">
          <CodeBlock title="config — generated from the switches" code={`const config: WorkspaceConfig = ${printValue(config)};`} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Tab types                                                                */
/* -------------------------------------------------------------------------- */

const COMMON_TAB_FIELDS: Field[] = [
  { name: "id", type: "string", required: true, description: "Unique id. Reported in every action payload and used by `visibility` / `filterWorkspace`." },
  { name: "type", type: '"text" | "icon" | "label" | "dropdown" | "custom"', required: true, description: "Which tab to render (also exported as `TAB_TYPE`)." },
  { name: "route", type: "string", description: "Navigate here on activation (`onNavigate`). Also drives active highlighting." },
];

const TAB_TYPES: Array<{ key: string; label: string; where: string; fields: Field[]; sample: TabConfig; code: string }> = [
  {
    key: "text",
    label: "text",
    where: "Horizontal bars only",
    fields: [
      { name: "text", type: "string", required: true, description: "Label (truncated after ~18 characters; full text in the tooltip)." },
      { name: "onClick", type: "() => void", description: "Called before the action is reported." },
      { name: "disabled", type: "boolean", description: "Greys out and blocks activation." },
    ],
    sample: { id: "reports", type: "text", text: "Reports", route: "/app/reports" },
    code: '{ id: "reports", type: "text", text: "Reports", route: "/app/reports" }',
  },
  {
    key: "icon",
    label: "icon",
    where: "Any bar",
    fields: [
      { name: "icon", type: "IconName", required: true, description: "Registry icon name (legacy `xxxIcon` names still resolve)." },
      { name: "label", type: "string", description: "Accessible name and tooltip — always set it." },
      { name: "onClick", type: "() => void", description: "Called before the action is reported." },
      { name: "disabled", type: "boolean", description: "Greys out and blocks activation." },
    ],
    sample: { id: "inbox", type: "icon", icon: "inbox", label: "Inbox", route: "/app/inbox" },
    code: '{ id: "inbox", type: "icon", icon: "inbox", label: "Inbox", route: "/app/inbox" }',
  },
  {
    key: "label",
    label: "label",
    where: "Horizontal bars and sidebars",
    fields: [
      { name: "text", type: "string", required: true, description: "Main text." },
      { name: "leftIcons / rightIcons", type: "TabIconItem[]", description: "`{ icon, label?, color?, onClick?, disabled?, clickable? }` — clickable icons become buttons (e.g. a ⋯ menu), others are decorative." },
      { name: "tokens", type: "TabToken[]", description: "Badges after the text: `{ text, color?, background? }` (counts, \"beta\", …)." },
      { name: "background / border", type: "string | null", description: "Custom fill / border (any CSS value)." },
      { name: "onClick", type: "() => void", description: "Makes the label interactive in bars." },
    ],
    sample: {
      id: "release",
      type: "label",
      text: "Release 1.2",
      leftIcons: [{ icon: "target" }],
      tokens: [{ text: "beta", background: "var(--irt-color-warning)", color: "var(--irt-color-on-warning)" }],
    },
    code: '{\n  id: "release",\n  type: "label",\n  text: "Release 1.2",\n  leftIcons: [{ icon: "target" }],\n  tokens: [{ text: "beta", background: "var(--irt-color-warning)", color: "var(--irt-color-on-warning)" }],\n}',
  },
  {
    key: "dropdown",
    label: "dropdown",
    where: "Any bar (vertical bars: icon trigger only)",
    fields: [
      { name: "trigger", type: '{ type: "text" | "icon"; text?; icon?; label? }', required: true, description: "What the tab looks like. Use `type: \"icon\"` in vertical bars." },
      { name: "items", type: "DropdownItem[]", required: true, description: "`string | { key, value, route?, icon?, description?, box?, danger?, disabled? }`. An item with `route` navigates; otherwise `onAction` gets `{ id, key }`." },
      { name: "onSelect", type: "(key) => void", description: "Called with the chosen item key." },
    ],
    sample: {
      id: "account",
      type: "dropdown",
      trigger: { type: "icon", icon: "userCircle", label: "Account" },
      items: [
        { key: "profile", value: "Profile", icon: "user", route: "/app/profile" },
        { key: "logout", value: "Log out", icon: "logout", danger: true },
      ],
    },
    code: '{\n  id: "account",\n  type: "dropdown",\n  trigger: { type: "icon", icon: "userCircle", label: "Account" },\n  items: [\n    { key: "profile", value: "Profile", icon: "user", route: "/app/profile" },\n    { key: "logout", value: "Log out", icon: "logout", danger: true },\n  ],\n}',
  },
  {
    key: "custom",
    label: "custom",
    where: "Any bar",
    fields: [
      { name: "render", type: "() => ReactNode", required: true, description: "Anything: a search box, a brand logo, a theme toggle. Use `useWorkspaceRoute()` inside for the current path." },
    ],
    sample: { id: "brand", type: "custom", render: () => <strong className="pg-ws-brand">Acme</strong> },
    code: '{ id: "brand", type: "custom", render: () => <Logo /> }',
  },
];

function TabTypeDemo({ sample }: { sample: TabConfig }) {
  const log = useLog();
  const config: WorkspaceConfig = { topPrimary: { center: [sample] } };
  return (
    <Frame height={50}>
      <Workspace
        config={config}
        currentPath="/app/inbox"
        barSize="48px"
        height="100%"
        width="100%"
        skipLinkLabel={false}
        onAction={(p) => log("onAction", p)}
        onNavigate={(route) => log("onNavigate", route)}
      />
    </Frame>
  );
}

function TabTypes() {
  return (
    <Tabs
      ariaLabel="Tab types"
      variant="pills"
      keepMounted={false}
      items={TAB_TYPES.map((t) => ({
        key: t.key,
        label: t.label,
        content: (
          <div className="pg-stack">
            <p className="pg-muted">
              <Badge size="small" tone="info">
                {t.where}
              </Badge>
            </p>
            <TabTypeDemo sample={t.sample} />
            <CodeBlock code={t.code} title={`${t.label} tab`} />
            <FieldTable fields={[...COMMON_TAB_FIELDS, ...t.fields]} />
          </div>
        ),
      }))}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Sidebars                                                                 */
/* -------------------------------------------------------------------------- */

const sidebarExample: SidebarItem[] = [
  { id: "overview", type: "label", text: "Overview", route: "/app", leftIcons: [{ icon: "home" }] },
  {
    id: "sales",
    type: "group",
    title: "Sales",
    icon: "target",
    defaultOpen: true,
    children: [
      { id: "leads", type: "label", text: "Leads", route: "/app/leads", leftIcons: [{ icon: "inbox" }], tokens: [{ text: "12" }] },
      {
        id: "deals",
        type: "group",
        title: "Deals",
        defaultOpen: true,
        children: [
          { id: "open", type: "label", text: "Open", route: "/app/deals/open" },
          { id: "won", type: "label", text: "Won", route: "/app/deals/won", tokens: [{ text: "new", background: "var(--irt-color-success)", color: "#fff" }] },
        ],
      },
    ],
  },
  {
    id: "settings",
    type: "group",
    title: "Settings",
    icon: "settings",
    children: [{ id: "team", type: "label", text: "Team", route: "/app/settings/team", rightIcons: [{ icon: "moreHorizontal", label: "Team options", onClick: () => undefined }] }],
  },
];

const SIDEBAR_CODE = `const sidebar: SidebarItem[] = [
  { id: "overview", type: "label", text: "Overview", route: "/app", leftIcons: [{ icon: "home" }] },
  {
    id: "sales", type: "group", title: "Sales", icon: "target", defaultOpen: true,
    children: [
      { id: "leads", type: "label", text: "Leads", route: "/app/leads", tokens: [{ text: "12" }] },
      {
        id: "deals", type: "group", title: "Deals", defaultOpen: true,      // groups nest
        children: [
          { id: "open", type: "label", text: "Open", route: "/app/deals/open" },
          { id: "won", type: "label", text: "Won", route: "/app/deals/won" },
        ],
      },
    ],
  },
  {
    id: "settings", type: "group", title: "Settings", icon: "settings",   // collapsed by default
    children: [
      { id: "team", type: "label", text: "Team", route: "/app/settings/team",
        rightIcons: [{ icon: "moreHorizontal", label: "Team options", onClick: openMenu }] },
    ],
  },
];

<Workspace config={{ leftSidebar: sidebar }} currentPath={pathname} onNavigate={navigate} />`;

function SidebarDemo() {
  const [path, setPath] = useState("/app/leads");
  const log = useLog();
  return (
    <Frame height={340}>
      <Workspace
        config={{ leftSidebar: sidebarExample }}
        currentPath={path}
        sidebarWidth="230px"
        height="100%"
        width="100%"
        skipLinkLabel={false}
        onNavigate={(route) => {
          setPath(route);
          log("onNavigate", route);
        }}
      >
        <div className="pg-guide-content">
          <span className="pg-eyebrow">currentPath</span>
          <code>{path}</code>
        </div>
      </Workspace>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Routing                                                                  */
/* -------------------------------------------------------------------------- */

const ROUTE_CASES: Array<[route: string, current: string, base: string | undefined]> = [
  ["/app/leads", "/app/leads/42", undefined],
  ["/app/leads", "/app/contacts", undefined],
  ["/app", "/app", undefined],
  ["/app", "/app/leads", undefined],
  ["leads", "/app/leads", undefined],
  ["leads", "/v2/app/leads", "/v2/app"],
];

function RouteTester() {
  const [route, setRoute] = useState("/app/leads");
  const [current, setCurrent] = useState("/app/leads/42");
  const [base, setBase] = useState("");
  const result = matchRoute(route, current, base || undefined);
  return (
    <div className="pg-stack">
      <div className="pg-guide-route-form">
        <TextInput label="tab route" value={route} setResult={setRoute} width="100%" />
        <TextInput label="currentPath" value={current} setResult={setCurrent} width="100%" />
        <TextInput label="basePath" placeholder="basePath (optional)" value={base} setResult={setBase} width="100%" />
        <div className="pg-guide-route-result">
          <Badge tone={result ? "success" : "neutral"} variant="soft" icon={result ? "check" : "close"}>
            {result ? "active" : "not active"}
          </Badge>
        </div>
      </div>
      <div className="pg-table-wrap">
        <table className="pg-props">
          <thead>
            <tr>
              <th>route</th>
              <th>currentPath</th>
              <th>basePath</th>
              <th>Active?</th>
            </tr>
          </thead>
          <tbody>
            {ROUTE_CASES.map(([r, c, b]) => (
              <tr key={`${r}-${c}-${b}`}>
                <td>
                  <code>{r}</code>
                </td>
                <td>
                  <code>{c}</code>
                </td>
                <td>{b ? <code>{b}</code> : <span className="pg-muted">—</span>}</td>
                <td>
                  <Badge size="small" tone={matchRoute(r, c, b) ? "success" : "neutral"}>
                    {matchRoute(r, c, b) ? "yes" : "no"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Visibility                                                               */
/* -------------------------------------------------------------------------- */

const visibilityConfig: WorkspaceConfig = {
  topPrimary: { start: [{ id: "brand", type: "custom", render: () => <strong className="pg-ws-brand">Suite</strong> }] },
  leftPrimary: {
    start: [
      { id: "crm", type: "icon", icon: "target", label: "CRM" },
      { id: "hr", type: "icon", icon: "users", label: "HR" },
    ],
    end: [{ id: "settings", type: "icon", icon: "settings", label: "Settings" }],
  },
  leftSidebar: [
    {
      id: "crm-group",
      type: "group",
      title: "CRM",
      collapsible: false,
      children: [
        { id: "crm-leads", type: "label", text: "Leads", route: "/crm/leads" },
        { id: "crm-deals", type: "label", text: "Deals", route: "/crm/deals" },
      ],
    },
    {
      id: "hr-group",
      type: "group",
      title: "HR",
      collapsible: false,
      children: [
        { id: "hr-people", type: "label", text: "People", route: "/hr/people" },
        { id: "hr-leave", type: "label", text: "Leave", route: "/hr/leave" },
      ],
    },
  ],
};

const visibility: WorkspaceVisibility = {
  alwaysVisible: ["brand", "crm", "hr", "settings"],
  map: { crm: ["crm-leads", "crm-deals"], hr: ["hr-people", "hr-leave"] },
  initialTab: "crm",
};

function VisibilityDemo() {
  const log = useLog();
  return (
    <Frame height={300}>
      <Workspace
        config={visibilityConfig}
        visibility={visibility}
        height="100%"
        width="100%"
        sidebarWidth="180px"
        skipLinkLabel={false}
        onAction={(p) => log("onAction", p)}
      >
        <div className="pg-guide-content">
          <span className="pg-muted">Click the CRM / HR icons — the sidebar swaps its items.</span>
        </div>
      </Workspace>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Validation                                                               */
/* -------------------------------------------------------------------------- */

const invalidExample: WorkspaceConfig = {
  leftPrimary: {
    start: [
      { id: "home", type: "icon", icon: "home", label: "Home" },
      { id: "reports", type: "text", text: "Reports" },
      { id: "more", type: "dropdown", trigger: { type: "text", text: "More" }, items: ["A"] },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* 7. Custom tab reading the route                                             */
/* -------------------------------------------------------------------------- */

function Breadcrumb() {
  const { currentPath } = useWorkspaceRoute();
  const parts = (currentPath ?? "").split("/").filter(Boolean);
  return (
    <span className="pg-guide-crumbs">
      {parts.map((p, i) => (
        <span key={`${p}-${i}`}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {p}
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Recipes                                                                     */
/* -------------------------------------------------------------------------- */

const RECIPES: Array<{ key: string; label: string; code: string }> = [
  {
    key: "next",
    label: "Next.js App Router",
    code: `// app/(app)/layout.tsx — server component
import { AppShell } from "./AppShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

// app/(app)/AppShell.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { Workspace } from "@itsrighttime/irt-ui/layout";
import { config } from "./workspace.config";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Workspace config={config} currentPath={usePathname()} onNavigate={(route) => router.push(route)}>
      {children}
    </Workspace>
  );
}`,
  },
  {
    key: "router",
    label: "react-router",
    code: `import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Workspace } from "@itsrighttime/irt-ui/layout";

export function AppShell() {
  const navigate = useNavigate();
  return (
    <Workspace config={config} currentPath={useLocation().pathname} onNavigate={(route) => navigate(route)}>
      <Outlet />
    </Workspace>
  );
}`,
  },
  {
    key: "roles",
    label: "Role-based config",
    code: `import { filterWorkspace, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";

// 1. Build the config from data — it is a plain object.
const buildConfig = (user: User): WorkspaceConfig => ({
  topPrimary: {
    start: [{ id: "user", type: "custom", render: () => <strong>{user.name}</strong> }],
    end: [{ id: "logout", type: "icon", icon: "logout", label: "Log out" }],
  },
  leftSidebar: [
    { id: "dashboard", type: "label", text: "Dashboard", route: "/app" },
    ...(user.isAdmin ? [{ id: "admin", type: "label" as const, text: "Admin", route: "/app/admin" }] : []),
  ],
});

// 2. …or keep one full config and filter it by the ids a user may see.
const visibleIds = new Set(permissions.map((p) => p.tabId));
const config = useMemo(() => filterWorkspace(fullConfig, visibleIds), [permissions]);`,
  },
  {
    key: "live",
    label: "Live badges",
    code: `// Config is re-read on every render: derive it from state with useMemo.
const { data: unread = 0 } = useUnreadCount();

const config = useMemo<WorkspaceConfig>(() => ({
  leftSidebar: [
    {
      id: "inbox", type: "label", text: "Inbox", route: "/app/inbox",
      tokens: unread ? [{ text: String(unread), background: "var(--irt-color-primary)", color: "var(--irt-color-on-primary)" }] : [],
    },
  ],
}), [unread]);`,
  },
  {
    key: "mobile",
    label: "Mobile drawer",
    code: `const [navOpen, setNavOpen] = useState(true);

const config = useMemo<WorkspaceConfig>(() => ({
  topPrimary: {
    start: [{
      id: "nav-toggle", type: "custom",
      render: () => <IconButton icon={navOpen ? "close" : "menu"} label="Toggle navigation" onClick={() => setNavOpen((o) => !o)} />,
    }],
  },
  leftSidebar: sidebar,
}), [navOpen]);

<Workspace
  config={config}
  leftSidebarOpen={navOpen}
  onSidebarOpenChange={(_, open) => setNavOpen(open)}  // backdrop click / Escape
  overlayBreakpoint={900}                               // below 900 px the sidebar floats over the content
  currentPath={pathname}
  onNavigate={(route) => { navigate(route); if (isMobile) setNavOpen(false); }}
/>`,
  },
  {
    key: "actions",
    label: "Handling actions",
    code: `<Workspace
  config={config}
  onNavigate={(route, payload) => router.push(route)}       // tabs/items that have a route
  onAction={({ id, key, route }) => {                      // every activation
    if (id === "logout") signOut();
    if (id === "account" && key === "billing") openBilling(); // dropdown item without a route
  }}
/>`,
  },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

const TOC: Array<[id: string, title: string]> = [
  ["anatomy", "Anatomy & slots"],
  ["bars", "Bar sections"],
  ["tabs", "Tab types"],
  ["sidebars", "Sidebar items"],
  ["routing", "Routing & actions"],
  ["visibility", "Context-aware visibility"],
  ["props", "Workspace props"],
  ["validation", "Validation rules"],
  ["api", "Helpers & types"],
  ["recipes", "Recipes"],
];

function EventsFooter() {
  const { events, clear } = useEvents();
  if (events.length === 0) return null;
  return (
    <div className="pg-guide-events" role="status" aria-live="polite">
      <span className="pg-muted">Last action</span>
      <code className="pg-event-name">{events[0]?.name}</code>
      <code>{events[0]?.payload}</code>
      <Button size="small" variant="ghost" onClick={clear}>
        Clear
      </Button>
    </div>
  );
}

function WorkspaceGuideInner() {
  const errors = validateWorkspaceConfig(invalidExample);
  return (
    <article className="pg-page pg-page-wide pg-guide">
      <header className="pg-page-header">
        <span className="pg-eyebrow">Layout · Guide</span>
        <h1>Workspace configuration</h1>
        <p className="pg-lead">
          The whole app shell is driven by one plain object, <code>WorkspaceConfig</code>. It says which bars and sidebars exist, which tabs
          they contain, where each tab navigates and what it shows. Change the object — from state, permissions or the server — and the
          layout follows. This guide covers every field, with live examples.
        </p>
        <CodeBlock code={'import { Workspace, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";'} bare />
      </header>

      <nav className="pg-guide-toc" aria-label="On this page">
        {TOC.map(([id, title]) => (
          <button key={id} type="button" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            {title}
          </button>
        ))}
      </nav>

      <Section
        id="anatomy"
        title="Anatomy & slots"
        lead="A Workspace has ten optional slots: eight bars around the content and two sidebars. Omit a slot (or give it no tabs) and it takes no space. Toggle slots below to see where each one sits and the config that produces it."
      >
        <SlotExplorer />
        <div className="pg-table-wrap">
          <table className="pg-props">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Position</th>
                <th>Value</th>
                <th>Allowed tabs</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["topPrimary", "Top edge, full width", "BarTabs", "all"],
                ["topSecondary", "Above the content (between the sidebars)", "BarTabs", "all"],
                ["bottomSecondary", "Below the content (between the sidebars)", "BarTabs", "all"],
                ["bottomPrimary", "Bottom edge, full width", "BarTabs", "all"],
                ["leftPrimary", "Outer left column", "BarTabs", "icon, icon-trigger dropdown, custom"],
                ["leftSecondary", "Inner left column", "BarTabs", "icon, icon-trigger dropdown, custom"],
                ["rightSecondary", "Inner right column", "BarTabs", "icon, icon-trigger dropdown, custom"],
                ["rightPrimary", "Outer right column", "BarTabs", "icon, icon-trigger dropdown, custom"],
                ["leftSidebar", "Between the left bars and the content", "SidebarItem[]", "label items and groups"],
                ["rightSidebar", "Between the content and the right bars", "SidebarItem[]", "label items and groups"],
              ].map(([slot, pos, value, allowed]) => (
                <tr key={slot}>
                  <td className="pg-prop-name">
                    <code>{slot}</code>
                  </td>
                  <td>{pos}</td>
                  <td className="pg-prop-type">
                    <code>{value}</code>
                  </td>
                  <td>{allowed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pg-muted">
          Slot names are also exported as constants: <code>WORKSPACE_SLOTS.TOP_PRIMARY</code> === <code>"topPrimary"</code>, …
        </p>
      </Section>

      <Section
        id="bars"
        title="Bar sections"
        lead="Every bar is a `BarTabs` object with up to three arrays. Horizontal bars lay them out left / middle / right; vertical bars top / middle / bottom. Empty sections keep their space so the others stay in place."
      >
        <FieldTable
          fields={[
            { name: "start", type: "TabConfig[]", description: "Left (horizontal) or top (vertical) group — brand, primary navigation." },
            { name: "center", type: "TabConfig[]", description: "Middle group — page tabs, search." },
            { name: "end", type: "TabConfig[]", description: "Right (horizontal) or bottom (vertical) group — notifications, account, settings." },
          ]}
        />
        <CodeBlock
          code={`const config: WorkspaceConfig = {
  topPrimary: {
    start:  [{ id: "brand", type: "custom", render: () => <Logo /> }],
    center: [{ id: "dashboard", type: "text", text: "Dashboard", route: "/app" },
             { id: "reports",   type: "text", text: "Reports",   route: "/app/reports" }],
    end:    [{ id: "bell", type: "icon", icon: "bell", label: "Notifications" }],
  },
  leftPrimary: {
    start: [{ id: "home", type: "icon", icon: "home", label: "Home", route: "/app" }],
    end:   [{ id: "settings", type: "icon", icon: "settings", label: "Settings", route: "/app/settings" }],
  },
};`}
        />
        <p className="pg-muted">
          <code>topPrimaryStart</code> (a Workspace prop) prepends any node to <code>topPrimary.start</code> without editing the config — handy
          for the signed-in user's name.
        </p>
      </Section>

      <Section
        id="tabs"
        title="Tab types"
        lead="Five tab types cover bars. Each demo below is a real Workspace bar rendering that single tab config — click it and watch the action at the bottom of the page."
      >
        <TabTypes />
      </Section>

      <Section
        id="sidebars"
        title="Sidebar items"
        lead="Sidebars take a list of `label` items and `group`s. Groups nest to any depth and are collapsible by default; a collapsed group that contains the active route is highlighted."
      >
        <SidebarDemo />
        <CodeBlock code={SIDEBAR_CODE} title="leftSidebar" />
        <h3>Label item</h3>
        <FieldTable
          fields={[
            { name: "id", type: "string", required: true, description: "Unique id." },
            { name: "type", type: '"label"', required: true, description: "Navigation item." },
            { name: "text", type: "string", required: true, description: "Item text (ellipsis when too long)." },
            { name: "route", type: "string", description: "Navigate here (`onNavigate`); drives the active state." },
            { name: "leftIcons / rightIcons", type: "TabIconItem[]", description: "`{ icon, label?, color?, onClick?, disabled?, clickable? }`. With `onClick` the icon is its own button (does not activate the item)." },
            { name: "tokens", type: "TabToken[]", description: "Badges: `{ text, color?, background? }`." },
            { name: "background / border", type: "string | null", description: "Custom fill / border." },
            { name: "onClick", type: "() => void", description: "Called when the item has no `route`." },
          ]}
        />
        <h3>Group</h3>
        <FieldTable
          fields={[
            { name: "id", type: "string", required: true, description: "Unique id (also used by `visibility`)." },
            { name: "type", type: '"group"', required: true, description: "Section of items." },
            { name: "title", type: "string", description: "Heading (uppercase, small)." },
            { name: "children", type: "SidebarItem[]", required: true, description: "Labels and/or nested groups." },
            { name: "icon", type: "IconName", description: "Icon before the title." },
            { name: "collapsible", type: "boolean", description: "`false` = always open, header is not a button. Default `true`." },
            { name: "defaultOpen", type: "boolean", description: "Initial state of a collapsible group. Default `false`." },
          ]}
        />
      </Section>

      <Section
        id="routing"
        title="Routing & actions"
        lead="The Workspace never navigates by itself. It highlights tabs whose `route` matches `currentPath` and tells you what was activated — you call your router."
      >
        <FieldTable
          fields={[
            { name: "currentPath", type: "string", description: "Current location (`usePathname()`, `useLocation().pathname`). Drives active tabs." },
            { name: "basePath", type: "string", description: "Prefix relative routes resolve against. Default: the first path segment." },
            { name: "isRouteActive", type: "(route?) => boolean", description: "Replace the matcher completely (query strings, hash routing, …)." },
            { name: "onNavigate", type: "(route, payload) => void", description: "Called for tabs / sidebar items / dropdown items that have a `route`." },
            { name: "onAction", type: "(payload) => void", description: "Called for every activation. `payload = { id, route?, key? }`; `key` is the dropdown item key." },
          ]}
        />
        <h3>How a route matches</h3>
        <ul className="pg-list">
          <li>
            <strong>Absolute</strong> routes (<code>/app/leads</code>) match by path-segment prefix — <code>/app/leads/42</code> keeps “Leads” active.
          </li>
          <li>
            A route that is <strong>only the base</strong> (<code>/app</code>) matches exactly, so a “Home” tab is not active on every page.
          </li>
          <li>
            <strong>Relative</strong> routes (<code>leads</code>) match after <code>basePath</code> (default: first segment).
          </li>
          <li>Query strings and hashes are ignored.</li>
        </ul>
        <RouteTester />
      </Section>

      <Section
        id="visibility"
        title="Context-aware visibility"
        lead="For multi-module apps, pass `visibility`: activating a parent tab (any id listed as a key in `map`) shows only the ids mapped to it, plus `alwaysVisible`. Groups stay when any child is visible."
      >
        <div className="pg-guide-split pg-guide-split-even">
          <VisibilityDemo />
          <CodeBlock
            title="visibility"
            code={`const visibility: WorkspaceVisibility = {
  alwaysVisible: ["brand", "crm", "hr", "settings"],
  map: {
    crm: ["crm-leads", "crm-deals"],   // click "crm" → these appear
    hr:  ["hr-people", "hr-leave"],
  },
  initialTab: "crm",
};

<Workspace config={config} visibility={visibility} />`}
          />
        </div>
        <FieldTable
          fields={[
            { name: "alwaysVisible", type: "string[]", required: true, description: "Ids shown regardless of the active parent." },
            { name: "map", type: "Record<string, string[]>", required: true, description: "Parent id → ids it reveals. Activating a parent makes it the active one." },
            { name: "initialTab", type: "string", description: "Active parent on first render." },
          ]}
        />
      </Section>

      <Section
        id="props"
        title="Workspace props"
        lead="Besides `config`, props control routing, sizing, sidebars and the content area. Generated from the TypeScript types."
      >
        <PropsTable components={["Workspace"]} />
        <ul className="pg-list">
          <li>
            <strong>Sizes:</strong> <code>barSize</code> (all bars) and <code>sidebarWidth</code> (both sidebars) accept any CSS length; defaults come
            from the theme (<code>layout.workspace.barSize</code> / <code>sidebarSize</code>). <code>height</code>/<code>width</code> default to the
            viewport.
          </li>
          <li>
            <strong>Sidebars:</strong> <code>leftSidebarOpen</code> / <code>rightSidebarOpen</code> show or hide them; below{" "}
            <code>overlayBreakpoint</code> (the Workspace's own width) they float as drawers and backdrop click / Escape call{" "}
            <code>onSidebarOpenChange(side, false)</code>.
          </li>
          <li>
            <strong>Content:</strong> <code>children</code> render in a scrollable <code>&lt;main&gt;</code>; style it with{" "}
            <code>contentClassName</code> / <code>contentStyle</code>. A “Skip to content” link is included (<code>skipLinkLabel</code>).
          </li>
        </ul>
      </Section>

      <Section
        id="validation"
        title="Validation rules"
        lead="Vertical bars are only one icon wide, so the config is validated on render and an invalid config throws `Invalid Workspace Config` (details are logged). Check configs ahead of time with `validateWorkspaceConfig`."
      >
        <ul className="pg-list">
          <li>
            Vertical slots (<code>left*</code> / <code>right*</code> Primary/Secondary) reject <code>text</code> and <code>label</code> tabs.
          </li>
          <li>
            A <code>dropdown</code> in a vertical slot must use <code>trigger.type: "icon"</code>.
          </li>
          <li>Ids should be unique across the whole config (actions, visibility and React keys rely on them).</li>
        </ul>
        <div className="pg-guide-split pg-guide-split-even">
          <CodeBlock
            title="invalid config"
            code={`const config: WorkspaceConfig = {
  leftPrimary: {
    start: [
      { id: "home", type: "icon", icon: "home", label: "Home" },
      { id: "reports", type: "text", text: "Reports" },               // ✗
      { id: "more", type: "dropdown", trigger: { type: "text", text: "More" }, items: ["A"] }, // ✗
    ],
  },
};

validateWorkspaceConfig(config);`}
          />
          <CodeBlock title="result" language="json" code={JSON.stringify(errors, null, 2)} />
        </div>
      </Section>

      <Section id="api" title="Helpers & types" lead="Everything is exported from `@itsrighttime/irt-ui/layout`.">
        <FieldTable
          fields={[
            { name: "WorkspaceConfig", type: "type", description: "The config object (all ten slots optional)." },
            { name: "BarTabs / TabConfig", type: "type", description: "`{ start?, center?, end? }` / union of the five tab types (`TextTab`, `IconTab`, `LabelTab`, `DropdownTab`, `CustomTab`)." },
            { name: "SidebarItem / SidebarGroup / SidebarTab", type: "type", description: "Sidebar entries." },
            { name: "TabIconItem / TabToken / DropdownItem", type: "type", description: "Icons, badges and dropdown items inside tabs." },
            { name: "TabActionPayload", type: "type", description: "`{ id, route?, key? }` passed to `onAction` / `onNavigate`." },
            { name: "WorkspaceVisibility", type: "type", description: "Visibility rules." },
            { name: "WORKSPACE_SLOTS / TAB_TYPE / TAB_ORIENTATION", type: "const", description: "String constants for slots, tab types and orientations." },
            { name: "matchRoute(route, currentPath, basePath?)", type: "function", description: "The default active-route matcher." },
            { name: "validateWorkspaceConfig(config)", type: "function", description: "Returns `{ slot, tabId, message }[]`." },
            { name: "filterWorkspace(config, visibleIds) / filterSidebar(items, visibleIds)", type: "function", description: "Copies with only the given ids (groups kept when a child is visible)." },
            { name: "useWorkspace(config, visibility?)", type: "hook", description: "`{ config, activeTab, activateTab }` — the visibility engine, for custom shells." },
            { name: "useWorkspaceRoute()", type: "hook", description: "`{ currentPath, isRouteActive }` inside custom tabs and pages." },
            { name: "TabBar / Sidebar", type: "component", description: "The pieces on their own, e.g. a page-level toolbar: `<TabBar config={{ start: […] }} onAction={…} />`." },
          ]}
        />
        <h3>Custom tab reading the route</h3>
        <div className="pg-guide-split pg-guide-split-even">
          <Frame height={50}>
            <Workspace
              config={{ topPrimary: { start: [{ id: "crumbs", type: "custom", render: () => <Breadcrumb /> }] } }}
              currentPath="/app/settings/team"
              barSize="48px"
              height="100%"
              width="100%"
              skipLinkLabel={false}
            />
          </Frame>
          <CodeBlock
            code={`function Breadcrumb() {
  const { currentPath } = useWorkspaceRoute();
  return <span>{currentPath?.split("/").filter(Boolean).join(" / ")}</span>;
}

topPrimary: { start: [{ id: "crumbs", type: "custom", render: () => <Breadcrumb /> }] }`}
          />
        </div>
      </Section>

      <Section id="recipes" title="Recipes" lead="Common integrations. The config is a plain object, so build it however your app needs.">
        <Tabs ariaLabel="Recipes" variant="enclosed" size="small" items={RECIPES.map((r) => ({ key: r.key, label: r.label, content: <CodeBlock code={r.code} /> }))} />
      </Section>

      <EventsFooter />
    </article>
  );
}

/** Dedicated guide for `WorkspaceConfig` (Layout › Workspace config). */
export function WorkspaceGuidePage() {
  return (
    <EventsProvider>
      <WorkspaceGuideInner />
    </EventsProvider>
  );
}
