"use client";

import { useContext, useState, type KeyboardEvent } from "react";
import { Icon } from "../../../../icons/Icon";
import { cx } from "../../../../utils/cx";
import type { OnTabAction, SidebarGroup, SidebarItem, SidebarTab } from "../bars/TabBar.types";
import { TabLabel } from "../bars/TabLabel";
import { TAB_TYPE } from "../const";
import type { WorkspaceSlot } from "../const/layout";
import { WorkspaceContext } from "../WorkspaceContext";
import styles from "./Sidebar.module.css";

export interface SidebarProps {
  config: SidebarItem[];
  /** Slot it is rendered in (decides the border side). */
  position: WorkspaceSlot | string;
  onAction?: OnTabAction;
  /** Override route matching (defaults to the surrounding `Workspace`). */
  isRouteActive?: (route?: string) => boolean;
  /** Accessible name of the navigation. @default "Sidebar" */
  ariaLabel?: string;
}

const INDENT = 8;
const BASE_INDENT = 4;

const activateOnKey = (handler: () => void) => (event: KeyboardEvent<HTMLElement>) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handler();
  }
};

/** Nested, collapsible navigation list. */
export function Sidebar({ config, position, onAction, isRouteActive, ariaLabel = "Sidebar" }: SidebarProps) {
  const ctx = useContext(WorkspaceContext);
  const isActive = isRouteActive ?? ctx.isRouteActive;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const walk = (items: SidebarItem[]) =>
      items.forEach((item) => {
        if (item.type === TAB_TYPE.GROUP) {
          initial[item.id] = item.defaultOpen ?? false;
          walk(item.children);
        }
      });
    walk(config);
    return initial;
  });

  const toggleGroup = (id: string) => setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const activate = (tab: SidebarTab) => {
    if (tab.route) {
      onAction?.({ route: tab.route, id: tab.id });
      return;
    }
    tab.onClick?.();
    onAction?.({ key: tab.id, id: tab.id });
  };

  const isGroupActive = (group: SidebarGroup): boolean =>
    group.children.some((child) => (child.type === TAB_TYPE.GROUP ? isGroupActive(child) : isActive(child.route)));

  const renderTab = (item: SidebarTab, depth: number) => {
    const active = isActive(item.route);
    return (
      <div
        key={item.id}
        role="link"
        tabIndex={0}
        aria-current={active ? "page" : undefined}
        className={cx(styles.item, active && styles.active)}
        style={{ marginLeft: BASE_INDENT + depth * INDENT }}
        onClick={() => activate(item)}
        onKeyDown={activateOnKey(() => activate(item))}
      >
        <TabLabel
          text={item.text}
          leftIcons={item.leftIcons}
          rightIcons={item.rightIcons}
          tokens={item.tokens}
          background={active ? "var(--irt-color-gray2)" : ""}
          border={item.border}
        />
      </div>
    );
  };

  const renderGroup = (group: SidebarGroup, depth: number) => {
    const isOpen = Boolean(openGroups[group.id]);
    const collapsible = group.collapsible !== false;
    const highlight = isGroupActive(group) && !isOpen;
    const childrenId = `irt-sidebar-${group.id}`;
    return (
      <div key={group.id} className={styles.group} role="group" aria-label={group.title}>
        <div
          className={cx(styles.groupHeader, highlight && styles.groupActive)}
          style={{ paddingLeft: BASE_INDENT + depth * INDENT }}
          role={collapsible ? "button" : undefined}
          tabIndex={collapsible ? 0 : undefined}
          aria-expanded={collapsible ? isOpen : undefined}
          aria-controls={collapsible ? childrenId : undefined}
          onClick={() => collapsible && toggleGroup(group.id)}
          onKeyDown={collapsible ? activateOnKey(() => toggleGroup(group.id)) : undefined}
        >
          <span>{group.title}</span>
          {collapsible && (
            <span aria-hidden="true" style={{ display: "inline-flex", color: "var(--irt-color-text)" }}>
              <Icon name={isOpen ? "chevronDown" : "chevronRight"} size="0.9em" />
            </span>
          )}
        </div>
        {(isOpen || !collapsible) && (
          <div id={childrenId} className={styles.groupChildren}>
            {group.children.map((child) =>
              child.type === TAB_TYPE.GROUP ? renderGroup(child, depth + 1) : renderTab(child, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  const side = position.startsWith("left") ? "right" : position.startsWith("right") ? "left" : "";

  return (
    <nav className={styles.sidebar} data-border-side={side} aria-label={ariaLabel}>
      {config.map((item) => (item.type === TAB_TYPE.GROUP ? renderGroup(item, 0) : renderTab(item, 0)))}
    </nav>
  );
}
