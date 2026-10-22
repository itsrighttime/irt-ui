"use client";

import { useEffect, useId, useMemo, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useControllableState } from "../../../hooks/useControllableState";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useIsMounted } from "../../../hooks/useIsMounted";
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
  className,
}: DialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
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

  useEscapeKey(onClose, isOpen);
  useFocusTrap(dialogRef, isOpen && mounted);

  if (!isOpen || !mounted || !container) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(styles.dialog, className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton
            icon="close"
            label="Close"
            onClick={onClose}
            color="var(--irt-color-on-danger)"
            size={1.2}
            className={styles.closeButton}
          />
        </div>

        <div className={styles.iconRow} role="tablist" aria-label={title}>
          {items.map((item) => {
            const isActive = item.key === activeItem?.key;
            const label = item.label ?? fromKebabCase(item.key, "capitalized");
            return (
              <Tooltip key={item.key} content={label}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={label}
                  className={cx(styles.iconBtn, isActive && styles.active)}
                  onClick={() => setActiveKey(item.key)}
                  disabled={item.disabled}
                >
                  {renderIcon(item.icon)}
                </button>
              </Tooltip>
            );
          })}
        </div>

        <div className={styles.body} role="tabpanel">
          {activeItem?.component}
        </div>
      </div>
    </div>,
    container,
  );
}
