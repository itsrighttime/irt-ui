"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../../../utils/cx";
import { cssVars } from "../../../../utils/cssVars";
import { TabBar } from "../bars/TabBar";
import type { BarTabs, TabActionPayload, TabConfig } from "../bars/TabBar.types";
import { TAB_ORIENTATION as TO, type TabOrientation } from "../const";
import { WORKSPACE_SLOTS as WS, type WorkspaceSlot } from "../const/layout";
import { matchRoute } from "../routing";
import { Sidebar } from "../sidebars/Sidebar";
import { WorkspaceContext, type WorkspaceContextValue } from "../WorkspaceContext";
import type { WorkspaceConfig, WorkspaceVisibility } from "./layout.types";
import { useWorkspace } from "./useWorkspace";
import { validateWorkspaceConfig } from "./validateWorkspaceConfig.helper";
import styles from "./Workspace.module.css";

export interface WorkspaceProps {
  /** Tabs and sidebars per slot. */
  config: WorkspaceConfig;
  /** Main content (e.g. your router outlet / Next.js `children`). */
  children?: ReactNode;
  /** Current path for active-tab highlighting (e.g. `usePathname()`). */
  currentPath?: string;
  /** Base path relative tab routes are resolved against. @default first path segment */
  basePath?: string;
  /** Custom active-route matcher (overrides `currentPath`/`basePath`). */
  isRouteActive?: (route?: string) => boolean;
  /** Navigate to a tab route (e.g. `router.push`). Without it, routes are reported via `onAction` only. */
  onNavigate?: (route: string, payload: TabActionPayload) => void;
  /** Called for every tab activation (with or without route). */
  onAction?: (payload: TabActionPayload) => void;
  /** Content prepended to the top-primary bar (e.g. the signed-in user's name). */
  topPrimaryStart?: ReactNode;
  /** Optional context-aware visibility rules. */
  visibility?: WorkspaceVisibility;
  /** @default "100vh" */
  height?: string;
  /** @default "100vw" */
  width?: string;
  className?: string;
  style?: CSSProperties;
  /** Thickness of every bar (any CSS length). @default theme `layout.workspace.barSize` */
  barSize?: string;
  /** Width of both sidebars (any CSS length). @default theme `layout.workspace.sidebarSize` */
  sidebarWidth?: string;
  /** Show the left sidebar (controlled). @default true */
  leftSidebarOpen?: boolean;
  /** Show the right sidebar (controlled). @default true */
  rightSidebarOpen?: boolean;
  /** Called when the workspace wants to close a sidebar (overlay backdrop click / Escape). */
  onSidebarOpenChange?: (side: "left" | "right", open: boolean) => void;
  /**
   * Below this workspace width (px) open sidebars float over the content as
   * drawers with a backdrop instead of pushing it. `0` disables. @default 0
   */
  overlayBreakpoint?: number;
  /** Render a "Skip to content" link for keyboard users (`false` disables). @default "Skip to content" */
  skipLinkLabel?: string | false;
  /** Class for the `<main>` content region. */
  contentClassName?: string;
  /** Style for the `<main>` content region (e.g. padding). */
  contentStyle?: CSSProperties;
}

const hasTabs = (bar?: BarTabs) => !!bar && Object.values(bar).some((tabs) => Array.isArray(tabs) && tabs.length > 0);

/**
 * Application shell with ten slots (four bars on each axis + two sidebars).
 * Router- and auth-agnostic: pass `children`, `currentPath` and `onNavigate`.
 */
export function Workspace({
  config,
  children,
  currentPath,
  basePath,
  isRouteActive,
  onNavigate,
  onAction,
  topPrimaryStart,
  visibility,
  height,
  width,
  className,
  style,
  barSize,
  sidebarWidth,
  leftSidebarOpen = true,
  rightSidebarOpen = true,
  onSidebarOpenChange,
  overlayBreakpoint = 0,
  skipLinkLabel = "Skip to content",
  contentClassName,
  contentStyle,
}: WorkspaceProps) {
  const { config: ws, activateTab } = useWorkspace(config, visibility);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const [narrow, setNarrow] = useState(false);

  // Track the workspace's own width (not the viewport) so embedded shells behave too.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || overlayBreakpoint <= 0 || typeof ResizeObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when the breakpoint is disabled
      setNarrow(false);
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setNarrow(entry.contentRect.width < overlayBreakpoint);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [overlayBreakpoint]);

  const errors = useMemo(() => validateWorkspaceConfig(ws), [ws]);
  if (errors.length) {
    console.error("[irt-ui] Invalid workspace config:", errors);
    throw new Error("Invalid Workspace Config");
  }

  const routeContext = useMemo<WorkspaceContextValue>(
    () => ({
      currentPath,
      isRouteActive: isRouteActive ?? ((route?: string) => matchRoute(route, currentPath, basePath)),
    }),
    [currentPath, basePath, isRouteActive],
  );

  const handleAction = useCallback(
    (payload: TabActionPayload) => {
      activateTab(String(payload.id));
      onAction?.(payload);
      if (payload.route) onNavigate?.(payload.route, payload);
    },
    [activateTab, onAction, onNavigate],
  );

  const topPrimary = useMemo<BarTabs | undefined>(() => {
    const bar = ws[WS.TOP_PRIMARY];
    if (!topPrimaryStart) return bar;
    const startTab: TabConfig = { id: "irt-top-primary-start", type: "custom", render: () => topPrimaryStart };
    return { ...bar, start: [startTab, ...(bar?.start ?? [])] };
  }, [ws, topPrimaryStart]);

  const bar = (tabs: BarTabs | undefined, orientation: TabOrientation, position: WorkspaceSlot, className?: string) =>
    hasTabs(tabs) ? (
      <div className={className}>
        <TabBar config={{ orientation, position, ...tabs }} onAction={handleAction} />
      </div>
    ) : null;

  const leftSidebar = ws[WS.LEFT_SIDEBAR];
  const rightSidebar = ws[WS.RIGHT_SIDEBAR];
  const showLeft = Boolean(leftSidebar && leftSidebar.length > 0 && leftSidebarOpen);
  const showRight = Boolean(rightSidebar && rightSidebar.length > 0 && rightSidebarOpen);
  const overlayOpen = narrow && (showLeft || showRight);

  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showLeft) onSidebarOpenChange?.("left", false);
      if (showRight) onSidebarOpenChange?.("right", false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [overlayOpen, showLeft, showRight, onSidebarOpenChange]);

  return (
    <WorkspaceContext.Provider value={routeContext}>
      <div
        ref={rootRef}
        className={cx(styles.workspace, narrow && styles.narrow, className)}
        style={cssVars(
          {
            "--irt-c-workspace-height": height,
            "--irt-c-workspace-width": width,
            "--irt-c-bar-size": barSize ?? "var(--irt-workspace-bar-size)",
            "--irt-c-sidebar-size": sidebarWidth ?? "var(--irt-workspace-sidebar-size)",
          },
          style,
        )}
      >
        {skipLinkLabel !== false && (
          <a
            href="#irt-workspace-main"
            className={styles.skipLink}
            onClick={(event) => {
              event.preventDefault();
              mainRef.current?.focus();
            }}
          >
            {skipLinkLabel}
          </a>
        )}
        {bar(topPrimary, TO.HORIZONTAL, WS.TOP_PRIMARY, styles.topPrimary)}

        <div className={styles.primaryVertical}>
          {bar(ws[WS.LEFT_PRIMARY], TO.VERTICAL, WS.LEFT_PRIMARY, styles.leftPrimary)}
          {bar(ws[WS.LEFT_SECONDARY], TO.VERTICAL, WS.LEFT_SECONDARY, styles.leftSecondary)}

          {showLeft && leftSidebar && (
            <div className={cx(styles.leftSidebar, narrow && styles.overlaySidebar)}>
              <Sidebar config={leftSidebar} position={WS.LEFT_SIDEBAR} onAction={handleAction} />
            </div>
          )}

          <div className={styles.secondaryHorizontal}>
            {bar(ws[WS.TOP_SECONDARY], TO.HORIZONTAL, WS.TOP_SECONDARY, styles.topSecondary)}
            <main
              ref={mainRef}
              id="irt-workspace-main"
              tabIndex={-1}
              className={cx(styles.content, contentClassName)}
              style={contentStyle}
            >
              {children}
            </main>
            {overlayOpen && (
              <div
                className={styles.backdrop}
                aria-hidden="true"
                onClick={() => {
                  if (showLeft) onSidebarOpenChange?.("left", false);
                  if (showRight) onSidebarOpenChange?.("right", false);
                }}
              />
            )}
            {bar(ws[WS.BOTTOM_SECONDARY], TO.HORIZONTAL, WS.BOTTOM_SECONDARY, styles.bottomSecondary)}
          </div>

          {showRight && rightSidebar && (
            <div className={cx(styles.rightSidebar, narrow && styles.overlaySidebar)}>
              <Sidebar config={rightSidebar} position={WS.RIGHT_SIDEBAR} onAction={handleAction} />
            </div>
          )}

          {bar(ws[WS.RIGHT_PRIMARY], TO.VERTICAL, WS.RIGHT_PRIMARY, styles.rightPrimary)}
          {bar(ws[WS.RIGHT_SECONDARY], TO.VERTICAL, WS.RIGHT_SECONDARY, styles.rightSecondary)}
        </div>

        {bar(ws[WS.BOTTOM_PRIMARY], TO.HORIZONTAL, WS.BOTTOM_PRIMARY, styles.bottomPrimary)}
      </div>
    </WorkspaceContext.Provider>
  );
}
