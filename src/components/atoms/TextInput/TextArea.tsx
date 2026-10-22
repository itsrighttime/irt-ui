"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
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
}: TextAreaProps) {
  const autoId = useId();
  const textAreaId = id ?? autoId;
  const errorId = `${textAreaId}-error`;
  const [inputValue, setInputValue] = useSyncedState(value ?? "");
  const [error, setError] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const validRef = useRef(setIsFieldValid);
  validRef.current = setIsFieldValid;

  useEffect(() => {
    if (backendError) {
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

  return (
    <div
      className={styles.textAreaContainer}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width }, style)}
    >
      {label && inputValue !== "" && (
        <label htmlFor={textAreaId} className={styles.label}>{`${label}${suffix}`}</label>
      )}
      <textarea
        id={textAreaId}
        ref={textAreaRef}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`${placeholder}${suffix}`}
        aria-label={label && inputValue === "" ? label : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-required={required || undefined}
        disabled={disabled}
        className={styles.textArea}
      />

      <div className={styles.errorInfo}>
        {error ? (
          <div id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </div>
        ) : (
          <div />
        )}
        <div className={styles.information}>
          {showCharacterCount && (
            <span className={styles.count}>
              Char: {inputValue.length}
              {maxLength ? `/${maxLength}` : ""}
            </span>
          )}
          {showCharacterCount && showWordCount && (
            <span className={styles.count} style={{ fontWeight: 800 }}>
              {" | "}
            </span>
          )}
          {showWordCount && <span className={styles.count}>Word: {countWords(inputValue)}</span>}
        </div>
      </div>
    </div>
  );
}
