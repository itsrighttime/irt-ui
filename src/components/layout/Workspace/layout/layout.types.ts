import type { BarTabs, SidebarItem } from "../bars/TabBar.types";
import type { WORKSPACE_SLOTS } from "../const/layout";

/** Tabs/sidebars per workspace slot. */
export interface WorkspaceConfig {
  [WORKSPACE_SLOTS.TOP_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.TOP_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.BOTTOM_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.BOTTOM_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.LEFT_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.LEFT_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.RIGHT_PRIMARY]?: BarTabs;
  [WORKSPACE_SLOTS.RIGHT_SECONDARY]?: BarTabs;
  [WORKSPACE_SLOTS.LEFT_SIDEBAR]?: SidebarItem[];
  [WORKSPACE_SLOTS.RIGHT_SIDEBAR]?: SidebarItem[];
}

/**
 * Optional "context-aware" visibility: activating a parent tab shows only
 * the ids mapped to it (plus `alwaysVisible`).
 */
export interface WorkspaceVisibility {
  /** Ids that are always shown. */
  alwaysVisible: string[];
  /** Parent tab id → ids it reveals. Activating an id listed here makes it the active parent. */
  map: Record<string, string[]>;
  /** Initially active parent id. */
  initialTab?: string;
}
