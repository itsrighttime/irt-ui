"use client";

import { useRef, type KeyboardEvent } from "react";
import { useSmartPosition } from "../../../hooks/useSmartPosition";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cx } from "../../../utils/cx";
import styles from "./DropdownSimple.module.css";

export type DropdownItem =
  | {
      key: string | number;
      /** Route to navigate to (handled by the consumer, e.g. TabBar). */
      route?: string;
      value: string;
      /** Small badges shown next to the label. */
      box?: string[];
      description?: string;
      disabled?: boolean;
      /** Leading icon (registry name or node). */
      icon?: IconLike;
      /** Render in the danger colour (e.g. "Delete"). */
      danger?: boolean;
    }
  | string;

export interface DropdownSimpleProps {
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
  isOpen?: boolean;
  /** Accessible menu name. */
  ariaLabel?: string;
  /** Called on Escape (and Tab) so the owner can close the menu. */
  onClose?: () => void;
  className?: string;
}

/** Simple action menu (`role="menu"`) that flips to stay inside the viewport. */
export function DropdownSimple({ items, onSelect, isOpen = false, ariaLabel, onClose, className }: DropdownSimpleProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const position = useSmartPosition(menuRef, isOpen);

  if (!isOpen) return null;

  const normalized = items.map((item) =>
    typeof item === "string"
      ? { key: item, value: item, box: [] as string[], description: "", disabled: false, icon: undefined, danger: false }
      : item,
  );

  const focusSibling = (event: KeyboardEvent<HTMLButtonElement>, delta: number | "first" | "last") => {
    const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? []);
    if (delta === "first") return buttons[0]?.focus();
    if (delta === "last") return buttons[buttons.length - 1]?.focus();
    const index = buttons.indexOf(event.currentTarget);
    buttons[(index + delta + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      style={{ opacity: position.ready ? 1 : 0, pointerEvents: position.ready ? "auto" : "none" }}
      className={cx(
        styles.dropdownMenu,
        position.vertical === "top" ? styles.dropTop : styles.dropBottom,
        position.horizontal === "left" ? styles.alignLeft : styles.alignRight,
        className,
      )}
    >
      {normalized.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          className={cx(styles.dropdownItem, item.danger && styles.danger)}
          onClick={() => onSelect?.(item.key)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              focusSibling(event, 1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              focusSibling(event, -1);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              focusSibling(event, event.key === "Home" ? "first" : "last");
            } else if (event.key === "Escape" || event.key === "Tab") {
              onClose?.();
            }
          }}
        >
          <span className={styles.dropdownItemLabelBox}>
            {item.icon != null && (
              <span className={styles.itemIcon} aria-hidden="true">
                {renderIcon(item.icon, { size: "1.1em" })}
              </span>
            )}
            <span className={styles.dropdownItemLabel}>{item.value}</span>
            {item.box?.map((badge, i) =>
              badge ? (
                <span key={i} className={styles.boxValue}>
                  {badge}
                </span>
              ) : null,
            )}
          </span>
          {item.description && <span className={styles.dropdownItemDescription}>{item.description}</span>}
        </button>
      ))}
    </div>
  );
}
