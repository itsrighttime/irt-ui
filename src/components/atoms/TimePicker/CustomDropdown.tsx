"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import styles from "./CustomDropdown.module.css";

export interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  color?: string;
  specialStyle?: CSSProperties;
  error?: boolean;
  disabled?: boolean;
  /** Accessible name (e.g. "Hours"). */
  ariaLabel?: string;
}

/** Compact listbox used by `TimePicker`. Opens upward near the viewport bottom. */
export function CustomDropdown({
  options,
  value,
  onChange,
  color,
  specialStyle,
  error = false,
  disabled = false,
  ariaLabel,
}: CustomDropdownProps) {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useClickOutside([rootRef], () => setIsOpen(false), isOpen);

  const open = () => {
    if (disabled) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) setIsAbove(rect.bottom + 150 > window.innerHeight);
    setIsOpen(true);
    requestAnimationFrame(() => {
      const selected = listRef.current?.querySelector<HTMLLIElement>("[aria-selected=true]");
      (selected ?? listRef.current?.querySelector<HTMLLIElement>("li"))?.focus();
    });
  };

  const choose = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const onOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, option: string) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLLIElement>("li") ?? []);
    const index = items.indexOf(event.currentTarget);
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(option);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      items[Math.min(index + 1, items.length - 1)]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[Math.max(index - 1, 0)]?.focus();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  /** ↑/↓ on the closed segment steps through the options without opening the list. */
  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const index = options.indexOf(value);
    const delta = event.key === "ArrowUp" ? 1 : -1;
    const next = options[index === -1 ? 0 : (index + delta + options.length) % options.length];
    if (next !== undefined) onChange(next);
  };

  return (
    <div
      className={styles.dropdown}
      ref={rootRef}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)" }, specialStyle)}
    >
      <button
        type="button"
        className={cx(styles.dropdownSelected, error && styles.error)}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-label={ariaLabel ? `${ariaLabel}: ${value}` : undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
      >
        {value}
      </button>
      {isOpen && (
        <ul id={listId} ref={listRef} role="listbox" aria-label={ariaLabel} className={cx(styles.dropdownOptions, isAbove && styles.above)}>
          {options.map((option) => (
            <li
              key={option}
              role="option"
              tabIndex={-1}
              aria-selected={option === value}
              className={cx(styles.dropdownOption, option === value && styles.optionSelected)}
              onClick={() => choose(option)}
              onKeyDown={(event) => onOptionKeyDown(event, option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
