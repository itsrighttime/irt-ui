"use client";

import { useContext } from "react";
import { cx } from "../../../../utils/cx";
import { TAB_ORIENTATION, TAB_TYPE } from "../const";
import { WorkspaceContext } from "../WorkspaceContext";
import styles from "./TabBar.module.css";
import type { OnTabAction, TabBarConfig, TabConfig } from "./TabBar.types";
import { TabDropdown } from "./TabDropdown";
import { TabIcon } from "./TabIcon";
import { TabLabel } from "./TabLabel";
import { TabText } from "./TabText";

export interface TabBarProps {
  config: TabBarConfig;
  onAction?: OnTabAction;
  /** Override route matching (defaults to the surrounding `Workspace`). */
  isRouteActive?: (route?: string) => boolean;
}

const borderSide = (position?: string) => {
  if (!position) return "";
  if (position.startsWith("top")) return "bottom";
  if (position.startsWith("bottom")) return "top";
  if (position.startsWith("left")) return "right";
  if (position.startsWith("right")) return "left";
  return "";
};

/** Bar with start / center / end tab sections. */
export function TabBar({ config, onAction, isRouteActive }: TabBarProps) {
  const ctx = useContext(WorkspaceContext);
  const isActive = isRouteActive ?? ctx.isRouteActive;
  const { orientation = TAB_ORIENTATION.HORIZONTAL, position, start, center, end } = config;

  const activate = (tab: TabConfig, key?: string | number) => {
    if ("onClick" in tab && tab.onClick) tab.onClick();
    if (tab.route) {
      onAction?.({ route: tab.route, id: tab.id });
      return;
    }
    onAction?.({ key, id: tab.id });
  };

  const renderTab = (tab: TabConfig) => {
    switch (tab.type) {
      case TAB_TYPE.TEXT:
        return <TabText key={tab.id} text={tab.text} onClick={() => activate(tab, tab.id)} isActive={isActive(tab.route)} />;
      case TAB_TYPE.LABEL:
        return (
          <TabLabel
            key={tab.id}
            text={tab.text}
            leftIcons={tab.leftIcons}
            rightIcons={tab.rightIcons}
            tokens={tab.tokens}
            background={tab.background}
            border={tab.border}
            onClick={() => activate(tab, tab.id)}
          />
        );
      case TAB_TYPE.ICON:
        return (
          <TabIcon key={tab.id} icon={tab.icon} label={tab.label} onClick={() => activate(tab, tab.id)} isActive={isActive(tab.route)} />
        );
      case TAB_TYPE.DROPDOWN:
        return (
          <TabDropdown
            key={tab.id}
            ariaLabel={tab.trigger.label ?? tab.trigger.text}
            trigger={
              tab.trigger.type === TAB_TYPE.TEXT ? (
                <TabText text={tab.trigger.text ?? ""} isActive={isActive(tab.route)} />
              ) : (
                <TabIcon icon={tab.trigger.icon ?? "menu"} label={tab.trigger.label} isActive={isActive(tab.route)} />
              )
            }
            items={tab.items}
            onSelect={(key) => {
              tab.onSelect?.(key);
              const item = tab.items.find(
                (i): i is Exclude<typeof i, string> => typeof i !== "string" && i.key === key,
              );
              if (item?.route) {
                onAction?.({ route: item.route, id: item.key });
                return;
              }
              activate(tab, key);
            }}
          />
        );
      case TAB_TYPE.CUSTOM:
        return <div key={tab.id}>{tab.render()}</div>;
      default:
        return null;
    }
  };

  const section = (tabs: TabConfig[] | undefined, className: string | undefined) =>
    tabs?.length ? <div className={cx(styles.section, className)}>{tabs.map(renderTab)}</div> : <div />;

  return (
    <div
      role="toolbar"
      aria-orientation={orientation === TAB_ORIENTATION.HORIZONTAL ? "horizontal" : "vertical"}
      className={cx(styles.bar, orientation === TAB_ORIENTATION.HORIZONTAL ? styles.horizontal : styles.vertical)}
      data-border-side={borderSide(position)}
    >
      {section(start, styles.start)}
      {section(center, styles.center)}
      {section(end, styles.end)}
    </div>
  );
}
