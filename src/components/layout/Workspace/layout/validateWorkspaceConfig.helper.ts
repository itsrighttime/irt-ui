import type { TabConfig } from "../bars/TabBar.types";
import { TAB_TYPE } from "../const";
import { WORKSPACE_SLOTS as WS, type WorkspaceSlot } from "../const/layout";
import type { WorkspaceConfig } from "./layout.types";

export interface WorkspaceValidationError {
  slot: string;
  tabId: string;
  message: string;
}

const VERTICAL_SLOTS: ReadonlySet<string> = new Set<WorkspaceSlot>([
  WS.LEFT_PRIMARY,
  WS.LEFT_SECONDARY,
  WS.RIGHT_PRIMARY,
  WS.RIGHT_SECONDARY,
]);

/**
 * Validates slot rules: vertical bars allow only icon tabs, icon-triggered
 * dropdowns and custom tabs.
 */
export function validateWorkspaceConfig(config: WorkspaceConfig): WorkspaceValidationError[] {
  const errors: WorkspaceValidationError[] = [];
  for (const [slot, value] of Object.entries(config)) {
    if (!value || Array.isArray(value) || !VERTICAL_SLOTS.has(slot)) continue;
    const tabs: TabConfig[] = [...(value.start ?? []), ...(value.center ?? []), ...(value.end ?? [])];
    for (const tab of tabs) {
      if (tab.type === TAB_TYPE.TEXT) {
        errors.push({ slot, tabId: tab.id, message: "TEXT tabs are not allowed in vertical slots" });
      } else if (tab.type === TAB_TYPE.LABEL) {
        errors.push({ slot, tabId: tab.id, message: "LABEL tabs are not allowed in vertical slots" });
      } else if (tab.type === TAB_TYPE.DROPDOWN && tab.trigger.type !== TAB_TYPE.ICON) {
        errors.push({ slot, tabId: tab.id, message: "Dropdown in vertical slots must use ICON trigger only" });
      }
    }
  }
  return errors;
}
