import { useEffect, useMemo, useState } from "react";
import { IconButton, SearchBox } from "@itsrighttime/irt-ui/atoms";
import { Workspace, type SidebarItem, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";
import { useTheme } from "@itsrighttime/irt-ui/theme";
import { entries, findEntry, groups } from "./docs/registry";
import { ComponentPage } from "./pages/ComponentPage";
import { HomePage } from "./pages/HomePage";
import { IconsPage } from "./pages/IconsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ThemePage } from "./pages/ThemePage";
import { navigate, useHashPath } from "./router";
import { usePlaygroundTheme } from "./state/themeStore";

const REPO = "https://github.com/itsrighttime/irt-ui";
const WIDE = "(min-width: 900px)";

const GROUP_ICONS: Record<string, "plus" | "edit" | "checkCircle" | "calendar" | "bell" | "copy" | "columns" | "image" | "fileText" | "home"> = {
  Actions: "plus",
  Inputs: "edit",
  Selection: "checkCircle",
  "Date & time": "calendar",
  Feedback: "bell",
  Overlays: "copy",
  Data: "columns",
  Media: "image",
  Content: "fileText",
  Layout: "home",
};

const sidebar: SidebarItem[] = [
  {
    id: "guide",
    type: "group",
    title: "Get started",
    collapsible: false,
    children: [
      { id: "home", type: "label", route: "/", text: "Introduction", leftIcons: [{ icon: "home" }] },
      { id: "overview", type: "label", route: "/catalog", text: "All components", leftIcons: [{ icon: "columns" }], tokens: [{ text: String(entries.length) }] },
      { id: "theme", type: "label", route: "/theme", text: "Theme builder", leftIcons: [{ icon: "settings" }] },
      { id: "icons", type: "label", route: "/icons", text: "Icons", leftIcons: [{ icon: "star" }] },
    ],
  },
  ...groups.map<SidebarItem>((group) => ({
    id: `group-${group}`,
    type: "group",
    title: group,
    icon: GROUP_ICONS[group],
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
      color="var(--irt-color-text-muted)"
      size={1.15}
    />
  );
}

function Page({ path }: { path: string }) {
  if (path === "/theme") return <ThemePage />;
  if (path === "/icons") return <IconsPage />;
  if (path === "/catalog") return <OverviewPage />;
  const match = /^\/components\/([\w-]+)/.exec(path);
  if (match?.[1]) {
    const entry = findEntry(match[1]);
    if (entry) return <ComponentPage key={entry.id} entry={entry} />;
  }
  return <HomePage />;
}

export function App() {
  const path = useHashPath();
  const [wide, setWide] = useState(() => window.matchMedia?.(WIDE).matches ?? true);
  const [navOpen, setNavOpen] = useState(wide);

  useEffect(() => {
    const query = window.matchMedia?.(WIDE);
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) => {
      setWide(event.matches);
      setNavOpen(event.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const entry = /^\/components\/([\w-]+)/.exec(path)?.[1];
    const title = entry ? findEntry(entry)?.title : path === "/theme" ? "Theme builder" : path === "/icons" ? "Icons" : path === "/catalog" ? "All components" : undefined;
    document.title = title ? `${title} · irt-ui` : "irt-ui — React component library";
  }, [path]);

  const config = useMemo<WorkspaceConfig>(
    () => ({
      topPrimary: {
        start: [
          {
            id: "nav-toggle",
            type: "custom",
            render: () => (
              <IconButton
                icon={navOpen ? "close" : "menu"}
                label={navOpen ? "Hide navigation" : "Show navigation"}
                onClick={() => setNavOpen((o) => !o)}
                color="var(--irt-color-text-muted)"
                size={1.15}
              />
            ),
          },
          {
            id: "brand",
            type: "custom",
            render: () => (
              <a href="#/" className="pg-brand">
                <span className="pg-logo" aria-hidden="true">
                  irt
                </span>
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
                <SearchBox
                  suggestions={suggestions}
                  minChars={1}
                  placeholder="Search components…"
                  ariaLabel="Search components"
                  width="300px"
                  setResult={(id) => navigate(`/components/${id}`)}
                />
              </div>
            ),
          },
        ],
        end: [
          { id: "mode", type: "custom", render: () => <ModeButton /> },
          {
            id: "github",
            type: "custom",
            render: () => (
              <a className="pg-header-link" href={REPO} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ),
          },
        ],
      },
      leftSidebar: sidebar,
    }),
    [navOpen],
  );

  return (
    <Workspace
      config={config}
      currentPath={path}
      height="100dvh"
      width="100%"
      barSize="52px"
      sidebarWidth="248px"
      leftSidebarOpen={navOpen}
      overlayBreakpoint={900}
      onSidebarOpenChange={(_, open) => setNavOpen(open)}
      onNavigate={(route) => {
        navigate(route);
        if (!wide) setNavOpen(false);
      }}
    >
      <Page path={path} />
    </Workspace>
  );
}
