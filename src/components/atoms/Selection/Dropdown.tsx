"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { useIsomorphicLayoutEffect } from "../../../hooks/useIsomorphicLayoutEffect";
import { Icon } from "../../../icons/Icon";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Button } from "../Button/Button";
import { DynamicPopover } from "../Overlay/DynamicPopover";
import type { PopoverPlacement } from "../Overlay/usePopoverPosition";
import { getFittedText } from "./helper/getFittedText";
import styles from "./Dropdown.module.css";

export interface DropdownProps {
  options: string[];
  /** Allow multiple selections. @default false */
  multiple?: boolean;
  /** Shown when empty; also the floating label when `label` is not set. @default "Select..." */
  placeholder?: string;
  /** Floating label shown once something is selected. @default placeholder */
  label?: string;
  /** Receives the full selection array. */
  setResult: (selected: string[]) => void;
  color?: string;
  /** Selected options. Re-syncs when changed by the parent. */
  value?: string[];
  /** Allow adding new options. */
  addNew?: boolean;
  /** Receives the full option list after an option is added. */
  setAddedOptions?: (options: string[]) => void;
  /** @default "300px" */
  width?: string;
  required?: boolean;
  disabled?: boolean;
}

const EMPTY: string[] = [];

/** Reports the popover placement from inside the render prop without mutating during render. */
function PlacementReporter({ placement, onChange }: { placement: PopoverPlacement; onChange: (p: PopoverPlacement) => void }) {
  useEffect(() => onChange(placement), [placement, onChange]);
  return null;
}

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
  required = false,
  disabled = false,
}: DropdownProps) {
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [allOptions, setAllOptions] = useSyncedState(options);
  const [selected, setSelected] = useSyncedState(value);
  const [searchTerm, setSearchTerm] = useState("");
  const [newOption, setNewOption] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [placement, setPlacement] = useState<PopoverPlacement>("bottom");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(
    () => allOptions.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase())),
    [allOptions, searchTerm],
  );

  useIsomorphicLayoutEffect(() => {
    const update = () => {
      const el = headerRef.current;
      if (!el) return;
      setDisplayText(getFittedText(selected, el.offsetWidth - 80, el));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selected]);

  const select = (option: string) => {
    const next = multiple
      ? selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
      : [option];
    setSelected(next);
    setResult(next);
    if (!multiple) {
      setIsOpen(false);
      headerRef.current?.focus();
    }
  };

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed || allOptions.includes(trimmed)) return;
    const updated = [...allOptions, trimmed];
    setAllOptions(updated);
    setAddedOptions?.(updated);
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
      setIsOpen(true);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const onOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, option: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(option);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const items = Array.from(
        event.currentTarget.closest("[data-irt-dropdown-menu]")?.querySelectorAll<HTMLLIElement>("[role=option]") ?? [],
      );
      const index = items.indexOf(event.currentTarget);
      items[index + (event.key === "ArrowDown" ? 1 : -1)]?.focus();
    }
  };

  const vars = cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width });
  const suffix = required ? " *" : "";
  const floatingLabel = label ?? placeholder;

  const renderOption = (option: string, key: string) => (
    <li
      key={key}
      role="option"
      tabIndex={0}
      aria-selected={selected.includes(option)}
      className={cx(styles.optionItem, selected.includes(option) && styles.selected)}
      onClick={() => select(option)}
      onKeyDown={(event) => onOptionKeyDown(event, option)}
    >
      {option}
    </li>
  );

  return (
    <div className={styles.dropdown} ref={rootRef} style={vars}>
      <div
        ref={headerRef}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-label={floatingLabel}
        className={cx(styles.dropdownHeader, isOpen && styles.open, placement === "top" ? styles.openUp : styles.openDown)}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={onHeaderKeyDown}
      >
        {floatingLabel && selected.length > 0 && <p className={styles.label}>{`${floatingLabel}${suffix}`}</p>}
        {selected.length ? (
          <div className={styles.selectedContainer}>
            <span className={styles.countBox}>{selected.length}</span>
            <span className={styles.previewText}>{displayText}</span>
          </div>
        ) : (
          <span className={styles.placeholder}>{`${placeholder}${suffix}`}</span>
        )}
        <span aria-hidden="true" style={{ color: color ?? "var(--irt-color-primary)", display: "inline-flex" }}>
          <Icon name={isOpen ? "chevronUp" : "chevronDown"} size="1.1em" />
        </span>
      </div>

      <DynamicPopover anchorRef={rootRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {({ placement: current }) => (
          <div
            data-irt-dropdown-menu=""
            className={cx(styles.dropdownMenu, current === "top" ? styles.openUp : styles.openDown)}
            style={vars}
          >
            <PlacementReporter placement={current} onChange={setPlacement} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
              placeholder="Search..."
              aria-label="Search options"
              aria-controls={listId}
              className={styles.searchInput}
            />

            <div className={styles.dropdownOptions}>
              {multiple && (
                <>
                  <div className={styles.selectedHeader}>Selected Options</div>
                  {selected.length > 0 ? (
                    <ul className={styles.optionList} role="listbox" aria-label="Selected options" aria-multiselectable>
                      {selected.map((option) => renderOption(option, `selected-${option}`))}
                    </ul>
                  ) : (
                    <div className={styles.emptyState}>Nothing selected</div>
                  )}
                  <div className={styles.selectedHeader}>All Options</div>
                </>
              )}

              <ul
                id={listId}
                className={styles.optionList}
                role="listbox"
                aria-label={floatingLabel}
                aria-multiselectable={multiple || undefined}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => renderOption(option, option))
                ) : (
                  <li className={styles.optionItem} role="option" aria-disabled="true" aria-selected={false}>
                    No Options Available
                  </li>
                )}
              </ul>

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
                  <Button onClick={addOption} color={color} variant="secondary">
                    Add
                  </Button>
                </div>
              )}

              {selected.length > 0 && (
                <div className={styles.buttons}>
                  <Button onClick={clear} width="90%" color={color} variant="secondary" size="small">
                    Clear Selection
                  </Button>
                  <Button onClick={() => setIsOpen(false)} width="90%" size="small" color={color}>
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DynamicPopover>
    </div>
  );
}
