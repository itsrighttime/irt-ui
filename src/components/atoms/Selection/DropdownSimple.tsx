"use client";

import { useRef, type KeyboardEvent } from "react";
import { useSmartPosition } from "../../../hooks/useSmartPosition";
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
    }
  | string;

export interface DropdownSimpleProps {
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
  isOpen?: boolean;
  /** Accessible menu name. */
  ariaLabel?: string;
}

/** Simple action menu (`role="menu"`) that flips to stay inside the viewport. */
export function DropdownSimple({ items, onSelect, isOpen = false, ariaLabel }: DropdownSimpleProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const position = useSmartPosition(menuRef, isOpen);

  if (!isOpen) return null;

  const normalized = items.map((item) =>
    typeof item === "string" ? { key: item, value: item, box: [] as string[], description: "", disabled: false } : item,
  );

  const focusSibling = (event: KeyboardEvent<HTMLButtonElement>, delta: number) => {
    const buttons = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? []);
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
      )}
    >
      {normalized.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          className={styles.dropdownItem}
          onClick={() => onSelect?.(item.key)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              focusSibling(event, 1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              focusSibling(event, -1);
            }
          }}
        >
          <span className={styles.dropdownItemLabelBox}>
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
