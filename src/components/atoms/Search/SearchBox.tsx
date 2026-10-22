"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
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
}: SearchBoxProps) {
  const listId = useId();
  const optionId = (index: number) => `${listId}-opt-${index}`;
  const [inputValue, setInputValue] = useState("");
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

  const expanded = show && (filtered.length > 0 || inputValue.length >= minChars);

  return (
    <div
      ref={boxRef}
      className={styles.searchBox}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width })}
    >
      <div className={styles.nameIcon}>
        <input
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
        <div className={styles.search} onMouseDown={(event) => event.preventDefault()}>
          <Button
            iconLeft="search"
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
                {suggestion.name}
              </li>
            ))
          ) : (
            <li className={styles.suggestionItem} role="option" aria-disabled="true" aria-selected={false}>
              No suggestions
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
