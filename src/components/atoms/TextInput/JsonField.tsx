"use client";

import { useState } from "react";
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
}: JsonFieldProps) {
  const [jsonInput, setJsonInput] = useState(value);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(true);

  const handleValidate = () => {
    try {
      const pretty = JSON.stringify(JSON.parse(jsonInput) as unknown, null, 2);
      setError("");
      setIsFieldValid(true);
      setJsonInput(pretty);
      setResult(pretty);
      if (hideOnSave) setEditing(false);
    } catch {
      setError("Invalid JSON format");
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
              <Button color={color} variant="secondary" size="small" onClick={handleValidate} width="150px">
                Validate & Save
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.onDataSave} role="status">
          Data saved Successfully
        </div>
      )}
    </div>
  );
}
