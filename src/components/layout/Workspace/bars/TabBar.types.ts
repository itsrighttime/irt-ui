import type { ReactNode } from "react";
import type { IconNameInput } from "../../../../icons/legacyAliases";
import type { DropdownItem } from "../../../atoms/Selection/DropdownSimple";
import type { TAB_TYPE, TabOrientation, TabType } from "../const";
import type { WorkspaceSlot } from "../const/layout";

interface BaseTab {
  id: string;
  type: TabType;
  /** Navigate here when activated (handled via `Workspace` `onNavigate`). */
  route?: string;
}

export interface TextTab extends BaseTab {
  type: typeof TAB_TYPE.TEXT;
  text: string;
  onClick?: () => void;
}

export interface IconTab extends BaseTab {
  type: typeof TAB_TYPE.ICON;
  /** Registry icon name (legacy `xxxIcon` names accepted). */
  icon: IconNameInput;
  label?: string;
  onClick?: () => void;
}

export interface DropdownTab extends BaseTab {
  type: typeof TAB_TYPE.DROPDOWN;
  trigger: {
    type: typeof TAB_TYPE.TEXT | typeof TAB_TYPE.ICON;
    text?: string;
    icon?: IconNameInput;
    label?: string;
  };
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
}

export interface CustomTab extends BaseTab {
  type: typeof TAB_TYPE.CUSTOM;
  render: () => ReactNode;
}

export interface TabIconItem {
  icon: IconNameInput;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
  color?: string;
  /** `false` renders a static icon even with `onClick`. */
  clickable?: boolean;
}

export interface TabToken {
  text: string;
  color?: string;
  background?: string;
}

export interface TabLabelProps {
  leftIcons?: TabIconItem[];
  rightIcons?: TabIconItem[];
  tokens?: TabToken[];
  text: string;
  border?: string | null;
  background?: string | null;
  onClick?: () => void;
}

export interface LabelTab extends BaseTab, TabLabelProps {
  type: typeof TAB_TYPE.LABEL;
}

export type TabConfig = TextTab | IconTab | DropdownTab | CustomTab | LabelTab;

export type SidebarTab = LabelTab;

export interface BarTabs {
  start?: TabConfig[];
  center?: TabConfig[];
  end?: TabConfig[];
}

export interface TabBarConfig extends BarTabs {
  position?: WorkspaceSlot;
  orientation?: TabOrientation;
}

export interface TabActionPayload {
  id: string | number;
  route?: string;
  key?: string | number;
}

/** Called when a tab/item is activated. */
export type OnTabAction = (payload: TabActionPayload) => void;
/** @deprecated Use `OnTabAction`. */
export type onActionType = OnTabAction;

export interface SidebarGroup {
  id: string;
  type: typeof TAB_TYPE.GROUP;
  title?: string;
  children: SidebarItem[];
  /** @default true */
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export type SidebarItem = SidebarTab | SidebarGroup;
