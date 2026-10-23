"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "../../../icons/Icon";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import { formatFileSize } from "./formatFileSize.helper";
import { getFileTypeLabel } from "./getFileType.helper";
import { pickFiles } from "./pickFiles";
import styles from "./Upload.module.css";
import { UploadDropzone, UploadFieldHeader, uploadHint } from "./UploadDropzone";

export interface FileUploadProps {
  /** Files to show. Re-syncs when changed by the parent. */
  value?: File[];
  /** @default "Upload File" */
  label?: string;
  /** Receives the full file list after every change. */
  setResult: (files: File[]) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  /** Allowed MIME types (empty = any). */
  allowedTypes?: string[];
  /** Max size per file in MB. @default Infinity */
  maxSizeMb?: number;
  /** @default Infinity */
  maxFiles?: number;
  /** @default "300px" */
  width?: string;
  /** @default "200px" */
  height?: string;
  backendError?: string;
  required?: boolean;
  /** Open files in a new tab on click. @default true */
  allowPreview?: boolean;
  /** Text inside the drop zone. @default label */
  dropzoneText?: ReactNode;
  /** Hint under the drop zone text. @default derived from types / size / count limits */
  hint?: ReactNode;
  /** Helper text under the field. */
  helperText?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const EMPTY: File[] = [];
const NO_TYPES: string[] = [];
const sameFile = (a: File, b: File) => a.name === b.name && a.size === b.size;

/** Drag-and-drop multi-file upload with per-file replace/remove. */
export function FileUpload({
  value = EMPTY,
  label = "Upload File",
  setResult,
  color,
  setIsFieldValid,
  allowedTypes = NO_TYPES,
  maxSizeMb = Number.POSITIVE_INFINITY,
  maxFiles = Number.POSITIVE_INFINITY,
  width = "300px",
  height = "200px",
  backendError = "",
  required = false,
  allowPreview = true,
  dropzoneText,
  hint,
  helperText,
  disabled = false,
  className,
}: FileUploadProps) {
  const messageId = useId();
  const [files, setFiles] = useSyncedState(value);
  const [error, setError] = useState<string | null>(null);
  const validRef = useRef(setIsFieldValid);
  useEffect(() => {
    validRef.current = setIsFieldValid;
  });

  const maxBytes = maxSizeMb * 1024 * 1024;
  const isMultiple = maxFiles !== 1;
  const accept = allowedTypes.length ? allowedTypes.join(",") : undefined;

  useEffect(() => {
    if (backendError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror an external error prop
      setError(backendError);
      validRef.current?.(false);
    }
  }, [backendError]);

  const validate = (file: File): boolean => {
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size > maxBytes) {
      setError(`File size exceeds limit of ${maxSizeMb} MB`);
      return false;
    }
    return true;
  };

  const commit = (next: File[]) => {
    setFiles(next);
    setResult(next);
  };

  const addFiles = (incoming: File[]) => {
    const fresh = incoming.filter(validate).filter((file) => !files.some((f) => sameFile(f, file)));
    if (fresh.length + files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    if (fresh.length > 0) {
      commit([...files, ...fresh]);
      validRef.current?.(true);
      setError(null);
    } else {
      validRef.current?.(false);
    }
  };

  const replaceAt = async (index: number) => {
    const [file] = await pickFiles({ accept });
    if (!file) return;
    if (!validate(file)) {
      validRef.current?.(false);
      return;
    }
    commit(files.map((f, i) => (i === index ? file : f)));
    validRef.current?.(true);
    setError(null);
  };

  const removeAt = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    commit(next);
    validRef.current?.(next.length > 0);
    if (next.length === 0) setError(null);
  };

  const reset = () => {
    commit([]);
    validRef.current?.(false);
    setError(null);
  };

  const preview = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const vars = cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height });
  const limited = Number.isFinite(maxFiles);
  const resolvedHint = hint ?? uploadHint({ types: allowedTypes, maxSizeMb, maxFiles });
  const message = error ?? helperText;

  return (
    <div className={cx(styles.field, className)} style={vars}>
      <UploadFieldHeader label={label} required={required} />

      {files.length === 0 && (
        <UploadDropzone
          inputLabel={label}
          title={dropzoneText ?? (isMultiple ? "Drop files here" : "Drop a file here")}
          hint={resolvedHint}
          accept={accept}
          multiple={isMultiple}
          required={required}
          invalid={Boolean(error)}
          disabled={disabled}
          describedBy={message ? messageId : undefined}
          onFiles={addFiles}
        />
      )}

      {files.length > 0 && (
        <>
          <ul className={styles.fileList}>
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${index}`} className={styles.fileRow}>
                <span className={styles.fileIcon} aria-hidden="true">
                  <Icon name={file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "music" : "fileText"} size="1.05em" />
                </span>
                <span className={styles.fileMeta}>
                  {allowPreview ? (
                    <button type="button" onClick={() => preview(file)} className={styles.fileName} title={`Open ${file.name}`}>
                      {file.name}
                    </button>
                  ) : (
                    <span className={styles.fileName}>{file.name}</span>
                  )}
                  <span className={styles.fileDetails}>
                    {getFileTypeLabel(file.type)} · {formatFileSize(file.size)}
                  </span>
                </span>
                <span className={styles.rowActions}>
                  <IconButton icon="refresh" onClick={() => void replaceAt(index)} color="var(--irt-color-text-muted)" label={`Replace ${file.name}`} disabled={disabled} />
                  <IconButton icon="close" onClick={() => removeAt(index)} color="var(--irt-color-danger)" label={`Remove ${file.name}`} disabled={disabled} />
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.listFooter}>
            <p className={styles.message} aria-live="polite">
              {limited ? `${files.length} of ${maxFiles} files` : `${files.length} ${files.length === 1 ? "file" : "files"}`}
            </p>
            <div className={styles.footerActions}>
              {isMultiple && files.length < maxFiles && (
                <button
                  type="button"
                  className={styles.linkButton}
                  disabled={disabled}
                  onClick={() => void pickFiles({ accept, multiple: true }).then(addFiles)}
                >
                  Add more
                </button>
              )}
              <button type="button" className={cx(styles.linkButton, styles.dangerLink)} onClick={reset} disabled={disabled}>
                Remove all
              </button>
            </div>
          </div>
        </>
      )}

      {message && (
        <p id={messageId} className={error ? styles.error : styles.message} role={error ? "alert" : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
