import type { BarTabs, SidebarItem } from "../bars/TabBar.types";
import { WORKSPACE_SLOTS } from "../const/layout";
import type { WorkspaceConfig } from "../layout/layout.types";

function filterTabs<T extends { id: string }>(tabs: T[] | undefined, visible: Set<string>): T[] {
  return tabs ? tabs.filter((tab) => visible.has(tab.id)) : [];
}

function filterBar(bar: BarTabs | undefined, visible: Set<string>): BarTabs {
  return {
    start: filterTabs(bar?.start, visible),
    center: filterTabs(bar?.center, visible),
    end: filterTabs(bar?.end, visible),
  };
}

/** Keeps sidebar labels whose id is visible, and groups that are visible or have visible children. */
export function filterSidebar(items: SidebarItem[] | undefined, visible: Set<string>): SidebarItem[] {
  if (!items) return [];
  const out: SidebarItem[] = [];
  for (const item of items) {
    if (item.type === "label") {
      if (visible.has(item.id)) out.push(item);
    } else {
      const children = filterSidebar(item.children, visible);
      if (children.length > 0 || visible.has(item.id)) out.push({ ...item, children });
    }
  }
  return out;
}

/** Returns a copy of `config` containing only tabs whose id is in `visible`. */
export function filterWorkspace(config: WorkspaceConfig, visible: Set<string>): WorkspaceConfig {
  const S = WORKSPACE_SLOTS;
  return {
    [S.TOP_PRIMARY]: filterBar(config[S.TOP_PRIMARY], visible),
    [S.TOP_SECONDARY]: filterBar(config[S.TOP_SECONDARY], visible),
    [S.BOTTOM_PRIMARY]: filterBar(config[S.BOTTOM_PRIMARY], visible),
    [S.BOTTOM_SECONDARY]: filterBar(config[S.BOTTOM_SECONDARY], visible),
    [S.LEFT_PRIMARY]: filterBar(config[S.LEFT_PRIMARY], visible),
    [S.LEFT_SECONDARY]: filterBar(config[S.LEFT_SECONDARY], visible),
    [S.RIGHT_PRIMARY]: filterBar(config[S.RIGHT_PRIMARY], visible),
    [S.RIGHT_SECONDARY]: filterBar(config[S.RIGHT_SECONDARY], visible),
    [S.LEFT_SIDEBAR]: filterSidebar(config[S.LEFT_SIDEBAR], visible),
    [S.RIGHT_SIDEBAR]: filterSidebar(config[S.RIGHT_SIDEBAR], visible),
  };
}
