"use client";

import { useState } from "react";
import { Icon } from "../../../icons/Icon";
import { cssVars } from "../../../utils/cssVars";
import { Button } from "../Button/Button";
import { getCommonCssVariables } from "./getCommonCssVariables";
import styles from "./JsonField.module.css";
import { TextArea } from "./TextArea";

export interface JsonFieldProps {
  label?: string;
  /** Called with pretty-printed JSON after successful validation. */
  setResult: (json: string) => void;
  setIsFieldValid: (isValid: boolean) => void;
  color?: string;
  /** Replace the editor with a success message after saving. */
  hideOnSave?: boolean;
  showCharacterCount?: boolean;
  showWordCount?: boolean;
  /** @default "300px" */
  width?: string;
  isBorder?: boolean;
  backendError?: string;
  value?: string;
  required?: boolean;
  /** Indentation used when formatting. @default 2 */
  indent?: number;
  /** Label of the save button. @default "Validate & Save" */
  saveLabel?: string;
}

/** JSON editor with "Validate & Save" (formats valid JSON, reports errors). */
export function JsonField({
  label,
  setResult,
  setIsFieldValid,
  color,
  hideOnSave = false,
  showCharacterCount = false,
  showWordCount = false,
  width = "300px",
  isBorder = false,
  backendError = "",
  value = "",
  required = false,
  indent = 2,
  saveLabel = "Validate & Save",
}: JsonFieldProps) {
  const [jsonInput, setJsonInput] = useState(value);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(true);

  const handleValidate = () => {
    try {
      const pretty = JSON.stringify(JSON.parse(jsonInput) as unknown, null, indent);
      setError("");
      setIsFieldValid(true);
      setJsonInput(pretty);
      setResult(pretty);
      if (hideOnSave) setEditing(false);
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message.replace(/^JSON\.parse: /, "") : "";
      setError(detail ? `Invalid JSON: ${detail}` : "Invalid JSON format");
      setIsFieldValid(false);
      setEditing(true);
    }
  };

  return (
    <div className={styles.jsonField} style={cssVars(getCommonCssVariables(isBorder, color, width), { width })}>
      {editing ? (
        <>
          <div className={styles.textInput}>
            <TextArea
              color={color}
              label={label}
              value={jsonInput}
              setResult={setJsonInput}
              onValueChange={(next) => {
                setJsonInput(next);
                if (error) setError("");
              }}
              className={styles.code}
              placeholder="Write JSON here..."
              showCharacterCount={showCharacterCount}
              showWordCount={showWordCount}
              backendError={backendError}
              width="100%"
              required={required}
            />
          </div>
          <div className={styles.errBtn}>
            {error ? (
              <div className={styles.error} role="alert">
                {error}
              </div>
            ) : (
              <div />
            )}
            <div className={styles.btn}>
              <Button color={color} variant="secondary" size="small" iconLeft="check" onClick={handleValidate}>
                {saveLabel}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.onDataSave} role="status">
          <span className={styles.savedIcon} aria-hidden="true">
            <Icon name="checkCircle" size="1.1em" />
          </span>
          <span>JSON saved</span>
          <Button variant="tertiary" size="small" color={color} onClick={() => setEditing(true)}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
