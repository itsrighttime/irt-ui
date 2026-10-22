"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useControllableState } from "../../../hooks/useControllableState";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cx } from "../../../utils/cx";
import styles from "./Tabs.module.css";

export interface TabItem {
  /** Unique key (reported by `onChange`). */
  key: string;
  label: ReactNode;
  /** Panel content. Omit to use `Tabs` as a plain tab strip. */
  content?: ReactNode;
  icon?: IconLike;
  /** Small count / badge after the label. */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled active key. */
  value?: string;
  /** Initial key when uncontrolled. @default first enabled item */
  defaultValue?: string;
  /** Called with the newly selected key. */
  onChange?: (key: string) => void;
  /** `underline` (default), `pills` or `enclosed` (segmented). */
  variant?: "underline" | "pills" | "enclosed";
  /** @default "medium" */
  size?: "small" | "medium";
  /** Stretch tabs to fill the width. */
  fitted?: boolean;
  /** Accessible name of the tab list. */
  ariaLabel?: string;
  /** Keep inactive panels mounted (hidden) to preserve their state. @default false */
  keepMounted?: boolean;
  className?: string;
  /** Class applied to the panel wrapper. */
  panelClassName?: string;
}

/**
 * Accessible tabs (WAI-ARIA tabs pattern): arrow keys / Home / End move
 * between tabs, panels are linked with `aria-controls`.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "medium",
  fitted = false,
  ariaLabel,
  keepMounted = false,
  className,
  panelClassName,
}: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement | null>(null);
  const firstEnabled = items.find((item) => !item.disabled)?.key ?? "";
  const [active, setActive] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabled,
    onChange,
  });
  const current = items.some((item) => item.key === active) ? active : firstEnabled;
  const hasPanels = items.some((item) => item.content !== undefined);

  const select = (key: string, focus = false) => {
    setActive(key);
    if (focus) {
      const index = items.findIndex((item) => item.key === key);
      listRef.current?.querySelectorAll<HTMLElement>("[role=tab]")[index]?.focus();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.key === current);
    let next: TabItem | undefined;
    if (event.key === "ArrowRight") next = enabled[(index + 1) % enabled.length];
    else if (event.key === "ArrowLeft") next = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    event.preventDefault();
    select(next.key, true);
  };

  return (
    <div className={cx(styles.tabs, styles[variant], styles[size], fitted && styles.fitted, className)}>
      <div ref={listRef} role="tablist" aria-label={ariaLabel} className={styles.list} onKeyDown={onKeyDown}>
        {items.map((item) => {
          const selected = item.key === current;
          return (
            <button
              key={item.key}
              id={`${baseId}-tab-${item.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={hasPanels ? `${baseId}-panel-${item.key}` : undefined}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={cx(styles.tab, selected && styles.selected)}
              onClick={() => select(item.key)}
            >
              {item.icon != null && (
                <span className={styles.icon} aria-hidden="true">
                  {renderIcon(item.icon, { size: "1.1em" })}
                </span>
              )}
              <span className={styles.label}>{item.label}</span>
              {item.badge != null && <span className={styles.badge}>{item.badge}</span>}
            </button>
          );
        })}
      </div>
      {hasPanels &&
        items.map((item) => {
          const selected = item.key === current;
          if (!selected && !keepMounted) return null;
          return (
            <div
              key={item.key}
              id={`${baseId}-panel-${item.key}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${item.key}`}
              hidden={!selected}
              tabIndex={0}
              className={cx(styles.panel, panelClassName)}
            >
              {item.content}
            </div>
          );
        })}
    </div>
  );
}
