import type { Dispatch, KeyboardEvent, RefObject, SetStateAction } from "react";

export interface Suggestion {
  code: string | number;
  name: string;
}

/** Case-insensitive substring filter on `name`. */
export const filterSuggestions = (suggestions: Suggestion[], value: string): Suggestion[] => {
  const needle = value.toLowerCase();
  return suggestions
    .filter((s) => s.name.toLowerCase().includes(needle))
    .map(({ code, name }) => ({ code, name }));
};

/** Arrow/Enter/Escape navigation for a suggestion list. `optionId(i)` returns each option's DOM id. */
export const handleKeyDown = (
  e: KeyboardEvent<HTMLInputElement>,
  showSuggestions: boolean,
  filteredSuggestions: Suggestion[],
  handleSuggestionClick: (suggestion: Suggestion) => void,
  highlightedIndex: number,
  setHighlightedIndex: Dispatch<SetStateAction<number>>,
  optionId: (index: number) => string = (i) => `suggestion-${i}`,
  onEscape?: () => void,
): void => {
  if (!showSuggestions) return;

  const move = (delta: number) => {
    e.preventDefault();
    setHighlightedIndex((prev) => {
      const next = Math.min(Math.max(prev + delta, 0), filteredSuggestions.length - 1);
      if (next !== prev) {
        document.getElementById(optionId(next))?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
      }
      return next;
    });
  };

  if (e.key === "ArrowDown") move(1);
  else if (e.key === "ArrowUp") move(-1);
  else if (e.key === "Enter") {
    e.preventDefault();
    const suggestion = filteredSuggestions[highlightedIndex];
    if (suggestion) handleSuggestionClick(suggestion);
  } else if (e.key === "Escape") {
    onEscape?.();
  }
};

/** Returns a mousedown listener that closes suggestions on outside clicks. */
export const handleClickOutside = (
  searchBoxRef: RefObject<HTMLDivElement | null>,
  setShowSuggestions: Dispatch<SetStateAction<boolean>>,
) => {
  return (event: MouseEvent): void => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };
};
