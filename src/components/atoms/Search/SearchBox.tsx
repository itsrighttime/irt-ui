"use client";

import { useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { Icon } from "../../../icons/Icon";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { Button } from "../Button/Button";
import { filterSuggestions, handleKeyDown, type Suggestion } from "./Search.helper";
import styles from "./SearchBox.module.css";

export type { Suggestion } from "./Search.helper";

export interface SearchBoxProps {
  suggestions: Suggestion[];
  /** Called with the chosen suggestion's `code`. */
  setResult: (value: string | number) => void;
  color?: string;
  /** @default "Search..." */
  placeholder?: string;
  /** @default "300px" */
  width?: string;
  /** Characters required before suggestions show. @default 3 */
  minChars?: number;
  /** Accessible name. @default placeholder */
  ariaLabel?: string;
  /** `outline` (bordered field) or `underline` (legacy look). @default "outline" */
  variant?: "outline" | "underline";
  /** Text shown when nothing matches. @default "No suggestions" */
  emptyText?: string;
  /** Called with the raw query on every keystroke (e.g. to fetch remote suggestions). */
  onQueryChange?: (query: string) => void;
  /** Show a clear (×) button while there is text. @default true */
  clearable?: boolean;
  /** Initial query text. */
  defaultQuery?: string;
  /** Custom suggestion renderer (defaults to the name with the match highlighted). */
  renderSuggestion?: (suggestion: Suggestion, query: string) => ReactNode;
  className?: string;
  id?: string;
}

/** Wraps the first case-insensitive occurrence of `query` in `<mark>`. */
function highlight(text: string, query: string): ReactNode {
  const index = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.match}>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

/** Autocomplete search (ARIA combobox) over a static suggestion list. */
export function SearchBox({
  suggestions,
  setResult,
  color,
  placeholder = "Search...",
  width = "300px",
  minChars = 3,
  ariaLabel,
  variant = "outline",
  emptyText = "No suggestions",
  onQueryChange,
  clearable = true,
  defaultQuery = "",
  renderSuggestion,
  className,
  id,
}: SearchBoxProps) {
  const listId = useId();
  const optionId = (index: number) => `${listId}-opt-${index}`;
  const [inputValue, setInputValue] = useState(defaultQuery);
  const [filtered, setFiltered] = useState<Suggestion[]>([]);
  const [show, setShow] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useClickOutside([boxRef], () => setShow(false), show);

  const openWith = (value: string) => {
    const results = filterSuggestions(suggestions, value);
    setFiltered(results);
    setShow(true);
    setHighlighted(results.length ? 0 : -1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    onQueryChange?.(value);
    if (value.length >= minChars) openWith(value);
    else {
      setShow(false);
      setHighlighted(-1);
    }
  };

  const choose = (suggestion: Suggestion) => {
    setInputValue(suggestion.name);
    setResult(suggestion.code);
    setShow(false);
  };

  const clear = () => {
    setInputValue("");
    onQueryChange?.("");
    setShow(false);
    setHighlighted(-1);
    inputRef.current?.focus();
  };

  const expanded = show && (filtered.length > 0 || inputValue.length >= minChars);

  return (
    <div
      ref={boxRef}
      className={cx(styles.searchBox, styles[variant], expanded && styles.expanded, className)}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width })}
    >
      <div className={styles.nameIcon}>
        <span className={styles.leadingIcon} aria-hidden="true">
          <Icon name="search" size="1.05em" />
        </span>
        <input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => inputValue.length >= minChars && setShow(true)}
          onKeyDown={(event) =>
            handleKeyDown(event, show, filtered, choose, highlighted, setHighlighted, optionId, () => setShow(false))
          }
          placeholder={placeholder}
          className={styles.input}
          aria-label={ariaLabel ?? placeholder}
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && highlighted >= 0 ? optionId(highlighted) : undefined}
        />
        {clearable && inputValue && (
          <button type="button" className={styles.clear} aria-label="Clear search" onMouseDown={(event) => event.preventDefault()} onClick={clear}>
            <Icon name="close" size="0.95em" />
          </button>
        )}
        <div className={styles.search} onMouseDown={(event) => event.preventDefault()}>
          <Button
            iconLeft="chevronRight"
            onClick={() => {
              inputRef.current?.focus();
              openWith(inputValue);
            }}
            ariaLabel="Search"
            iconOnly
            color={color}
            variant="ghost"
            size="small"
          />
        </div>
      </div>

      {expanded && (
        <ul id={listId} className={styles.suggestionsList} role="listbox">
          {filtered.length > 0 ? (
            filtered.map((suggestion, index) => (
              <li
                key={suggestion.code}
                id={optionId(index)}
                role="option"
                aria-selected={index === highlighted}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(suggestion)}
                className={cx(styles.suggestionItem, index === highlighted && styles.highlighted)}
              >
                {renderSuggestion ? renderSuggestion(suggestion, inputValue) : highlight(suggestion.name, inputValue)}
              </li>
            ))
          ) : (
            <li className={cx(styles.suggestionItem, styles.empty)} role="option" aria-disabled="true" aria-selected={false}>
              {emptyText}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
