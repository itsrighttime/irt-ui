"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { Icon } from "../../../icons/Icon";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { useTheme } from "../../../theme/useTheme";
import type { SizeToken } from "../../../theme/types";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Button } from "../Button/Button";
import { DynamicPopover } from "../Overlay/DynamicPopover";
import styles from "./Dropdown.module.css";

/** A dropdown option with a display label, description, icon or disabled state. */
export interface DropdownOption {
  /** Value reported through `setResult`. */
  value: string;
  /** Display text. @default value */
  label?: string;
  /** Secondary line under the label. */
  description?: string;
  /** Leading icon (registry name or node). */
  icon?: IconLike;
  disabled?: boolean;
}

export interface DropdownProps {
  /** Options: plain strings (value = label) or {@link DropdownOption} objects. */
  options: Array<string | DropdownOption>;
  /** Allow multiple selections. @default false */
  multiple?: boolean;
  /** Shown when empty; also the floating label when `label` is not set. @default "Select..." */
  placeholder?: string;
  /** Floating label shown once something is selected. @default placeholder */
  label?: string;
  /** Receives the full selection array (option values). */
  setResult: (selected: string[]) => void;
  /** Accent colour. @default var(--irt-color-primary) */
  color?: string;
  /** Selected values. Re-syncs when changed by the parent. */
  value?: string[];
  /** Allow adding new options. */
  addNew?: boolean;
  /** Receives the full option list (values) after an option is added. */
  setAddedOptions?: (options: string[]) => void;
  /** @default "300px" */
  width?: string;
  /** Stretch to the container width (overrides `width`). */
  block?: boolean;
  /** Control height preset. @default theme `components.input.size` */
  size?: SizeToken;
  required?: boolean;
  disabled?: boolean;
  /** Show the search box in the menu. @default true */
  searchable?: boolean;
  /** Placeholder of the search box. @default "Search..." */
  searchPlaceholder?: string;
  /** Text when no option matches. @default "No options" */
  emptyText?: string;
  /** Helper text under the field. */
  helperText?: ReactNode;
  /** Error message (also sets the invalid state). */
  error?: ReactNode;
  /** Maximum menu height in px. @default 300 */
  maxMenuHeight?: number;
  /** Accessible name when there is no visible label/placeholder text. */
  ariaLabel?: string;
  /** Float the label above the field once a value is selected. Set `false` when the field already has an external label. @default true */
  floatingLabel?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
}

const EMPTY: string[] = [];

const normalize = (option: string | DropdownOption): DropdownOption =>
  typeof option === "string" ? { value: option } : option;

/** Searchable single/multi-select dropdown with optional "add new". */
export function Dropdown({
  options = EMPTY,
  multiple = false,
  placeholder = "Select...",
  label,
  setResult,
  color,
  value = EMPTY,
  addNew = false,
  setAddedOptions,
  width = "300px",
  block = false,
  size,
  required = false,
  disabled = false,
  searchable = true,
  searchPlaceholder = "Search...",
  emptyText = "No options",
  helperText,
  error,
  maxMenuHeight = 300,
  ariaLabel,
  onOpenChange,
  floatingLabel: showFloatingLabel = true,
  id,
  className,
}: DropdownProps) {
  const { theme } = useTheme();
  const autoId = useId();
  const baseId = id ?? autoId;
  const listId = `${baseId}-list`;
  const messageId = `${baseId}-msg`;
  const [isOpen, setIsOpenState] = useState(false);
  const [allOptions, setAllOptions] = useSyncedState(options);
  const [selected, setSelected] = useSyncedState(value);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOption, setNewOption] = useState("");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const normalized = useMemo(() => allOptions.map(normalize), [allOptions]);
  const labelOf = (val: string) => {
    const found = normalized.find((option) => option.value === val);
    return found?.label ?? found?.value ?? val;
  };

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return normalized;
    return normalized.filter((option) =>
      `${option.label ?? option.value} ${option.description ?? ""}`.toLowerCase().includes(term),
    );
  }, [normalized, searchTerm]);

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open);
    onOpenChange?.(open);
    if (!open) setSearchTerm("");
  };

  const focusFirstOption = () => {
    requestAnimationFrame(() => {
      const menu = menuRef.current;
      // Don't steal focus if the user already moved into the menu (e.g. clicked "Add new").
      if (!menu || menu.contains(document.activeElement)) return;
      const target =
        menu.querySelector<HTMLElement>("input[data-irt-search]") ??
        menu.querySelector<HTMLElement>("[role=option][aria-selected=true]:not([aria-disabled=true])") ??
        menu.querySelector<HTMLElement>("[role=option]:not([aria-disabled=true])");
      target?.focus();
    });
  };

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    focusFirstOption();
  };

  const close = (restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) headerRef.current?.focus();
  };

  const select = (option: DropdownOption) => {
    if (option.disabled) return;
    const val = option.value;
    const next = multiple ? (selected.includes(val) ? selected.filter((item) => item !== val) : [...selected, val]) : [val];
    setSelected(next);
    setResult(next);
    if (!multiple) close();
  };

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed || normalized.some((option) => option.value === trimmed)) return;
    const updated = [...allOptions, trimmed];
    setAllOptions(updated);
    setAddedOptions?.(updated.map((option) => normalize(option).value));
    setNewOption("");
    setSearchTerm("");
  };

  const clear = () => {
    setSelected([]);
    setResult([]);
  };

  const onHeaderKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      open();
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      close();
    } else if ((event.key === "Backspace" || event.key === "Delete") && selected.length > 0 && !required) {
      event.preventDefault();
      clear();
    }
  };

  const optionElements = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=option]:not([aria-disabled=true])") ?? []);

  const moveFocus = (from: HTMLElement | null, delta: 1 | -1 | "first" | "last") => {
    const items = optionElements();
    if (items.length === 0) return;
    if (delta === "first") return items[0]?.focus();
    if (delta === "last") return items[items.length - 1]?.focus();
    const index = from ? items.indexOf(from) : -1;
    if (index === -1) return (delta === 1 ? items[0] : items[items.length - 1])?.focus();
    const next = items[index + delta];
    if (next) next.focus();
    else if (delta === -1) menuRef.current?.querySelector<HTMLElement>("input[data-irt-search]")?.focus();
  };

  const onOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, option: DropdownOption) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(option);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(event.currentTarget, event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      moveFocus(null, event.key === "Home" ? "first" : "last");
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      close(false);
    }
  };

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(null, "first");
    } else if (event.key === "Enter") {
      event.preventDefault();
      const first = filteredOptions.find((option) => !option.disabled);
      if (first) select(first);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const resolvedSize = size ?? theme.components.input.size;
  const vars = cssVars({
    "--irt-c-color": color ?? "var(--irt-color-primary)",
    "--irt-c-width": block ? "100%" : width,
    "--irt-c-height": theme.layout.control.height[resolvedSize],
  });
  const suffix = required ? " *" : "";
  const floatingLabel = label ?? placeholder;
  const message = error || helperText;
  const selectedLabels = selected.map(labelOf);

  const renderOption = (option: DropdownOption, key: string) => {
    const isSelected = selected.includes(option.value);
    return (
      <li
        key={key}
        role="option"
        tabIndex={-1}
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        className={cx(styles.optionItem, isSelected && styles.selected, option.disabled && styles.optionDisabled)}
        onClick={() => select(option)}
        onKeyDown={(event) => onOptionKeyDown(event, option)}
      >
        {multiple && (
          <span className={styles.checkbox} aria-hidden="true">
            <Icon name={isSelected ? "checkboxOn" : "checkboxOff"} size="1.1em" />
          </span>
        )}
        {option.icon != null && (
          <span className={styles.optionIcon} aria-hidden="true">
            {renderIcon(option.icon, { size: "1.1em" })}
          </span>
        )}
        <span className={styles.optionText}>
          <span className={styles.optionLabel}>{option.label ?? option.value}</span>
          {option.description && <span className={styles.optionDescription}>{option.description}</span>}
        </span>
        {!multiple && isSelected && (
          <span className={styles.check} aria-hidden="true">
            <Icon name="check" size="1em" />
          </span>
        )}
      </li>
    );
  };

  return (
    <div
      className={cx(styles.dropdown, styles[resolvedSize], block && styles.block, disabled && styles.disabled, className)}
      style={vars}
    >
      <div ref={rootRef} className={styles.anchor}>
        <div
          ref={headerRef}
          id={baseId}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          aria-label={ariaLabel ?? floatingLabel}
          className={cx(styles.dropdownHeader, isOpen && styles.open, Boolean(error) && styles.invalid)}
          onClick={() => (isOpen ? close(false) : open())}
          onKeyDown={onHeaderKeyDown}
        >
          {showFloatingLabel && floatingLabel && selected.length > 0 && (
            <span className={styles.label}>{`${floatingLabel}${suffix}`}</span>
          )}
          {selected.length ? (
            <span className={styles.selectedContainer}>
              {multiple && <span className={styles.countBox}>{selected.length}</span>}
              <span className={styles.previewText} title={selectedLabels.join(", ")}>
                {selectedLabels.join(", ")}
              </span>
            </span>
          ) : (
            <span className={styles.placeholder}>{`${placeholder}${suffix}`}</span>
          )}
          <span aria-hidden="true" className={cx(styles.chevron, isOpen && styles.chevronOpen)}>
            <Icon name="chevronDown" size="1.1em" />
          </span>
        </div>
      </div>

      {message && (
        <span id={messageId} className={cx(styles.helperText, Boolean(error) && styles.errorText)} role={error ? "alert" : undefined}>
          {message}
        </span>
      )}

      <DynamicPopover anchorRef={rootRef} isOpen={isOpen} onClose={() => setIsOpen(false)} offset={4}>
        {({ placement }) => (
          <div
            ref={menuRef}
            data-irt-dropdown-menu=""
            data-placement={placement}
            className={cx(styles.dropdownMenu, placement === "top" ? styles.openUp : styles.openDown)}
            style={{ ...vars, maxHeight: maxMenuHeight }}
          >
            {searchable && (
              <div className={styles.searchRow}>
                <span className={styles.searchIcon} aria-hidden="true">
                  <Icon name="search" size="1em" />
                </span>
                <input
                  data-irt-search=""
                  type="text"
                  value={searchTerm}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={searchPlaceholder}
                  aria-label="Search options"
                  aria-controls={listId}
                  className={styles.searchInput}
                />
              </div>
            )}

            <div className={styles.dropdownOptions}>
              <ul
                id={listId}
                className={styles.optionList}
                role="listbox"
                aria-label={ariaLabel ?? floatingLabel}
                aria-multiselectable={multiple || undefined}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => renderOption(option, option.value))
                ) : (
                  <li className={styles.emptyState} role="option" aria-disabled="true" aria-selected={false}>
                    {emptyText}
                  </li>
                )}
              </ul>
            </div>

            {addNew && (
              <div className={styles.addNewOption}>
                <input
                  type="text"
                  value={newOption}
                  onChange={(event) => setNewOption(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addOption();
                    }
                  }}
                  placeholder="Add new option"
                  aria-label="Add new option"
                />
                <Button onClick={addOption} color={color} variant="secondary" size="small" iconLeft="plus" disabled={!newOption.trim()}>
                  Add
                </Button>
              </div>
            )}

            {selected.length > 0 || multiple ? (
              <div className={styles.buttons}>
                {selected.length > 0 && (
                  <Button onClick={clear} color={color} variant="ghost" size="small">
                    Clear Selection
                  </Button>
                )}
                {multiple && (
                  <Button onClick={() => close()} size="small" color={color}>
                    Done
                  </Button>
                )}
              </div>
            ) : null}
          </div>
        )}
      </DynamicPopover>
    </div>
  );
}
