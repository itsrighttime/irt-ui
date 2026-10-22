"use client";

import { useEffect, useId, useMemo, useRef, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useControllableState } from "../../../hooks/useControllableState";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { usePortalContainer } from "../../../theme/useTheme";
import { cx } from "../../../utils/cx";
import { fromKebabCase } from "../../../utils/string";
import { IconButton } from "../Button/IconButton";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./Dialog.module.css";

export interface DialogItem {
  /** Unique key (also used for the tab label when `label` is omitted). */
  key: string;
  /** Tab icon: registry name or node. */
  icon: IconLike;
  /** Panel content. */
  component: ReactNode;
  /** Tab label / tooltip. @default fromKebabCase(key) */
  label?: string;
  disabled?: boolean;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: DialogItem[];
  /** Controlled active tab key. */
  activeKey?: string | null;
  /** Initial tab when uncontrolled. @default first item */
  defaultActiveKey?: string;
  /**
   * Called when the user selects a tab. Use it (with `activeKey`) to sync the
   * tab to the URL with your router, e.g. `?tab=security`.
   */
  onActiveKeyChange?: (key: string) => void;
  /** Show text labels next to the tab icons (otherwise labels are tooltips). @default false */
  showLabels?: boolean;
  /** Panel width (any CSS length). @default "min(720px, 92vw)" */
  width?: string;
  /** @default true */
  closeOnOverlayClick?: boolean;
  /** @default true */
  closeOnEscape?: boolean;
  /** Prevent the page behind from scrolling while open. @default true */
  lockScroll?: boolean;
  /** Optional footer (e.g. Save / Cancel buttons). */
  footer?: ReactNode;
  className?: string;
}

/**
 * Modal dialog with an icon tab bar. Router-agnostic: tab state is internal
 * or controlled via `activeKey` / `onActiveKeyChange`.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  items,
  activeKey: activeKeyProp,
  defaultActiveKey,
  onActiveKeyChange,
  showLabels = false,
  width,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockScroll = true,
  footer,
  className,
}: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const container = usePortalContainer();
  const mounted = useIsMounted();

  const [activeKey, setActiveKey] = useControllableState<string | null>({
    value: activeKeyProp === undefined ? undefined : activeKeyProp,
    defaultValue: defaultActiveKey ?? null,
    onChange: (key) => {
      if (key !== null) onActiveKeyChange?.(key);
    },
  });

  const activeItem = useMemo(
    () => items.find((item) => item.key === activeKey) ?? items[0],
    [activeKey, items],
  );

  // Ensure a default tab is reported when opening without one.
  useEffect(() => {
    if (isOpen && !activeKey && items[0]) setActiveKey(items[0].key);
  }, [isOpen, activeKey, items, setActiveKey]);

  useEscapeKey(onClose, isOpen && closeOnEscape);
  useFocusTrap(dialogRef, isOpen && mounted);
  useScrollLock(isOpen && mounted && lockScroll);

  /** Arrow/Home/End keys move between enabled tabs (WAI-ARIA tabs pattern). */
  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.key === activeItem?.key);
    let next: DialogItem | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = enabled[(index + 1) % enabled.length];
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    event.preventDefault();
    setActiveKey(next.key);
    const key = next.key;
    requestAnimationFrame(() => {
      const tabs = tabListRef.current?.querySelectorAll<HTMLElement>("[role=tab]") ?? [];
      Array.from(tabs)
        .find((el) => el.dataset.key === key)
        ?.focus();
    });
  };

  if (!isOpen || !mounted || !container) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(styles.dialog, className)}
        style={width ? { width } : undefined}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon="close" label="Close" onClick={onClose} color="var(--irt-color-text-muted)" size={1.1} />
        </div>

        <div
          ref={tabListRef}
          className={cx(styles.iconRow, showLabels && styles.withLabels)}
          role="tablist"
          aria-label={title}
          onKeyDown={onTabKeyDown}
        >
          {items.map((item) => {
            const isActive = item.key === activeItem?.key;
            const label = item.label ?? fromKebabCase(item.key, "capitalized");
            const tab = (
              <button
                key={item.key}
                type="button"
                role="tab"
                data-key={item.key}
                aria-selected={isActive}
                aria-controls={panelId}
                aria-label={showLabels ? undefined : label}
                tabIndex={isActive ? 0 : -1}
                className={cx(styles.iconBtn, isActive && styles.active)}
                onClick={() => setActiveKey(item.key)}
                disabled={item.disabled}
              >
                <span className={styles.tabIcon} aria-hidden="true">
                  {renderIcon(item.icon, { size: "1.15em" })}
                </span>
                {showLabels && <span className={styles.tabLabel}>{label}</span>}
              </button>
            );
            return showLabels ? (
              tab
            ) : (
              <Tooltip key={item.key} content={label}>
                {tab}
              </Tooltip>
            );
          })}
        </div>

        <div
          id={panelId}
          className={styles.body}
          role="tabpanel"
          aria-label={activeItem ? (activeItem.label ?? fromKebabCase(activeItem.key, "capitalized")) : undefined}
        >
          {activeItem?.component}
        </div>
        {footer != null && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    container,
  );
}
