import { useMemo, useState } from "react";
import { IconButton, SearchBox } from "@itsrighttime/irt-ui/atoms";
import { Workspace, type SidebarItem, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";
import { useTheme } from "@itsrighttime/irt-ui/theme";
import { entries, findEntry, groups } from "./docs/registry";
import { ComponentPage } from "./pages/ComponentPage";
import { HomePage } from "./pages/HomePage";
import { IconsPage } from "./pages/IconsPage";
import { ThemePage } from "./pages/ThemePage";
import { navigate, useHashPath } from "./router";
import { usePlaygroundTheme } from "./state/themeStore";

const REPO = "https://github.com/itsrighttime/irt-ui";

const sidebar: SidebarItem[] = [
  {
    id: "guide",
    type: "group",
    title: "Guide",
    defaultOpen: true,
    collapsible: false,
    children: [
      { id: "home", type: "label", route: "/", text: "Getting started", leftIcons: [{ icon: "home" }] },
      { id: "theme", type: "label", route: "/theme", text: "Theme builder", leftIcons: [{ icon: "settings" }] },
      { id: "icons", type: "label", route: "/icons", text: "Icons", leftIcons: [{ icon: "search" }] },
    ],
  },
  ...groups.map<SidebarItem>((group) => ({
    id: `group-${group}`,
    type: "group",
    title: group,
    defaultOpen: true,
    children: entries
      .filter((e) => e.group === group)
      .map<SidebarItem>((e) => ({ id: e.id, type: "label", route: `/components/${e.id}`, text: e.title })),
  })),
];

const suggestions = entries.map((e) => ({ code: e.id, name: e.title }));

function ModeButton() {
  const { resolvedMode } = useTheme();
  const { setMode } = usePlaygroundTheme();
  const dark = resolvedMode === "dark";
  return (
    <IconButton
      icon={dark ? "sun" : "moon"}
      label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setMode(dark ? "light" : "dark")}
      color="var(--irt-color-text)"
      size={1.3}
    />
  );
}

function Page({ path }: { path: string }) {
  if (path === "/theme") return <ThemePage />;
  if (path === "/icons") return <IconsPage />;
  const match = /^\/components\/([\w-]+)/.exec(path);
  if (match?.[1]) {
    const entry = findEntry(match[1]);
    if (entry) return <ComponentPage key={entry.id} entry={entry} />;
  }
  return <HomePage />;
}

export function App() {
  const path = useHashPath();
  const [navOpen, setNavOpen] = useState(() => window.matchMedia?.("(min-width: 800px)").matches ?? true);

  const config = useMemo<WorkspaceConfig>(
    () => ({
      topPrimary: {
        start: [
          {
            id: "nav-toggle",
            type: "custom",
            render: () => (
              <IconButton icon={navOpen ? "close" : "menu"} label={navOpen ? "Hide navigation" : "Show navigation"} onClick={() => setNavOpen((o) => !o)} color="var(--irt-color-text)" size={1.3} />
            ),
          },
          {
            id: "brand",
            type: "custom",
            render: () => (
              <a href="#/" className="pg-brand">
                <span className="pg-logo">irt</span>
                <span>irt-ui</span>
                <small>v{__LIB_VERSION__}</small>
              </a>
            ),
          },
        ],
        center: [
          {
            id: "search",
            type: "custom",
            render: () => (
              <div className="pg-search">
                <SearchBox suggestions={suggestions} minChars={1} placeholder="Find a component…" ariaLabel="Find a component" width="260px" setResult={(id) => navigate(`/components/${id}`)} />
              </div>
            ),
          },
        ],
        end: [
          { id: "mode", type: "custom", render: () => <ModeButton /> },
          { id: "github", type: "icon", icon: "externalLink", label: "GitHub repository" },
        ],
      },
      ...(navOpen ? { leftSidebar: sidebar } : {}),
    }),
    [navOpen],
  );

  return (
    <Workspace
      config={config}
      currentPath={path}
      height="100dvh"
      width="100%"
      onNavigate={(route) => {
        navigate(route);
        if (!window.matchMedia?.("(min-width: 800px)").matches) setNavOpen(false);
      }}
      onAction={(payload) => {
        if (payload.id === "github") window.open(REPO, "_blank", "noopener");
      }}
    >
      <Page path={path} />
    </Workspace>
  );
}
