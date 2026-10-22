"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { useIsomorphicLayoutEffect } from "../../../hooks/useIsomorphicLayoutEffect";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { cssVars } from "../../../utils/cssVars";
import styles from "./TextArea.module.css";

export interface TextAreaProps {
  label?: string;
  /** Current text. Re-syncs when changed by the parent. */
  value?: string;
  /** Called with the text on blur. */
  setResult: (value: string) => void;
  /** Focus colour. @default var(--irt-color-primary) */
  color?: string;
  /** @default "Enter text here..." */
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  /** Auto-grow limit in px. @default 200 */
  maxTextAreaHeight?: number;
  setIsFieldValid?: (isValid: boolean) => void;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  /** @default "300px" */
  width?: string;
  /** @deprecated Has no effect; the label floats once text is entered. */
  showLabelAlways?: boolean;
  /** Server-side validation error (cleared when the user types). */
  backendError?: string;
  required?: boolean;
  id?: string;
  /** Called on every keystroke (`setResult` fires on blur). */
  onValueChange?: (value: string) => void;
  /** Minimum visible rows. @default 3 */
  minRows?: number;
  /** Let the user resize vertically (disables auto-grow limit handling). @default false */
  resizable?: boolean;
  /** Helper text shown under the field when there is no error. */
  helperText?: ReactNode;
  /** External error message (same as `backendError`, but not cleared on typing). */
  error?: string;
  /** Accessible name when there is no visible `label`. */
  ariaLabel?: string;
  className?: string;
}

const countWords = (text: string): number => (text.trim() ? text.trim().split(/\s+/).length : 0);

/** Auto-growing textarea with length validation and character/word counters. */
export function TextArea({
  label,
  value,
  setResult,
  color,
  placeholder = "Enter text here...",
  minLength,
  maxLength,
  maxTextAreaHeight = 200,
  setIsFieldValid,
  showCharacterCount = false,
  showWordCount = false,
  disabled = false,
  style,
  width = "300px",
  backendError = "",
  required = false,
  id,
  onValueChange,
  minRows = 3,
  resizable = false,
  helperText,
  error: errorProp,
  ariaLabel,
  className,
}: TextAreaProps) {
  const autoId = useId();
  const textAreaId = id ?? autoId;
  const errorId = `${textAreaId}-error`;
  const [inputValue, setInputValue] = useSyncedState(value ?? "");
  const [error, setError] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const validRef = useRef(setIsFieldValid);
  useEffect(() => {
    validRef.current = setIsFieldValid;
  });

  useEffect(() => {
    if (backendError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror an external error prop
      setError(backendError);
      validRef.current?.(false);
    }
  }, [backendError]);

  useIsomorphicLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const height = el.scrollHeight;
    if (height < maxTextAreaHeight) {
      el.style.height = `${height + 5}px`;
      el.style.overflowY = "hidden";
    } else {
      el.style.height = `${maxTextAreaHeight}px`;
      el.style.overflowY = "auto";
    }
  }, [inputValue, maxTextAreaHeight]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    if (backendError) validRef.current?.(true);

    if (maxLength !== undefined && next.length > maxLength) {
      setError(`Maximum length is ${maxLength} characters.`);
      return;
    }
    setInputValue(next);
    onValueChange?.(next);
    if (minLength !== undefined && next.length < minLength) {
      setError(`Minimum length is ${minLength} characters.`);
    } else {
      setError("");
    }
  };

  const handleBlur = () => {
    setResult(inputValue);
    validRef.current?.(error === "");
  };

  const suffix = required ? " *" : "";
  const shownError = errorProp || error;
  const counters: string[] = [];
  if (showCharacterCount) counters.push(`${inputValue.length}${maxLength ? ` / ${maxLength}` : ""} characters`);
  if (showWordCount) counters.push(`${countWords(inputValue)} ${countWords(inputValue) === 1 ? "word" : "words"}`);
  const nearLimit = maxLength !== undefined && inputValue.length >= maxLength * 0.9;

  return (
    <div
      className={cx(styles.textAreaContainer, Boolean(shownError) && styles.invalid, className)}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width }, style)}
    >
      {label && inputValue !== "" && (
        <label htmlFor={textAreaId} className={styles.label}>{`${label}${suffix}`}</label>
      )}
      <textarea
        id={textAreaId}
        ref={textAreaRef}
        value={inputValue}
        rows={minRows}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`${placeholder}${suffix}`}
        aria-label={ariaLabel ?? (label && inputValue === "" ? label : undefined)}
        aria-invalid={shownError ? true : undefined}
        aria-describedby={shownError || helperText ? errorId : undefined}
        aria-required={required || undefined}
        disabled={disabled}
        className={cx(styles.textArea, resizable && styles.resizable)}
      />

      {(shownError || helperText || counters.length > 0) && (
        <div className={styles.errorInfo}>
          {shownError ? (
            <div id={errorId} className={styles.errorMessage} role="alert">
              {shownError}
            </div>
          ) : helperText ? (
            <div id={errorId} className={styles.helperText}>
              {helperText}
            </div>
          ) : (
            <div />
          )}
          {counters.length > 0 && (
            <div className={cx(styles.information, nearLimit && styles.nearLimit)} aria-live="polite">
              {counters.map((text, index) => (
                <span key={text} className={styles.count}>
                  {index > 0 && <span aria-hidden="true"> · </span>}
                  {text}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
