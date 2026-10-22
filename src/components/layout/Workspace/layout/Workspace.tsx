"use client";

import { useCallback, useMemo, type CSSProperties, type ReactNode } from "react";
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
}: WorkspaceProps) {
  const { config: ws, activateTab } = useWorkspace(config, visibility);

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

  return (
    <WorkspaceContext.Provider value={routeContext}>
      <div
        className={[styles.workspace, className].filter(Boolean).join(" ")}
        style={cssVars({ "--irt-c-workspace-height": height, "--irt-c-workspace-width": width }, style)}
      >
        {bar(topPrimary, TO.HORIZONTAL, WS.TOP_PRIMARY, styles.topPrimary)}

        <div className={styles.primaryVertical}>
          {bar(ws[WS.LEFT_PRIMARY], TO.VERTICAL, WS.LEFT_PRIMARY, styles.leftPrimary)}
          {bar(ws[WS.LEFT_SECONDARY], TO.VERTICAL, WS.LEFT_SECONDARY, styles.leftSecondary)}

          {leftSidebar && leftSidebar.length > 0 && (
            <div className={styles.leftSidebar}>
              <Sidebar config={leftSidebar} position={WS.LEFT_SIDEBAR} onAction={handleAction} />
            </div>
          )}

          <div className={styles.secondaryHorizontal}>
            {bar(ws[WS.TOP_SECONDARY], TO.HORIZONTAL, WS.TOP_SECONDARY, styles.topSecondary)}
            <main className={styles.content}>{children}</main>
            {bar(ws[WS.BOTTOM_SECONDARY], TO.HORIZONTAL, WS.BOTTOM_SECONDARY, styles.bottomSecondary)}
          </div>

          {rightSidebar && rightSidebar.length > 0 && (
            <div className={styles.rightSidebar}>
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
