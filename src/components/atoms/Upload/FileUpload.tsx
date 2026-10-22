"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import { formatFileSize } from "./formatFileSize.helper";
import { getFileTypeLabel } from "./getFileType.helper";
import { pickFiles } from "./pickFiles";
import { useDropZone } from "./useDropZone";
import styles from "./FileUpload.module.css";

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
}: FileUploadProps) {
  const [files, setFiles] = useSyncedState(value);
  const [error, setError] = useState<string | null>(null);
  const validRef = useRef(setIsFieldValid);
  validRef.current = setIsFieldValid;

  const maxBytes = maxSizeMb * 1024 * 1024;
  const isMultiple = maxFiles !== 1;
  const accept = allowedTypes.length ? allowedTypes.join(",") : undefined;

  useEffect(() => {
    if (backendError) {
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

  const { isDragging, handlers } = useDropZone<HTMLDivElement>(addFiles);
  const vars = cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height });
  const limited = Number.isFinite(maxFiles);

  return (
    <div className={styles.fileUploadContainer} style={vars}>
      {label && <p className={styles.label}>{label}</p>}
      {required && (
        <p className={styles.required} aria-hidden="true">
          *
        </p>
      )}

      {files.length === 0 && (
        <div className={cx(styles.fileUpload, isDragging && styles.dragging)} {...handlers}>
          <input
            type="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              addFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
            title=""
            aria-label={label}
            aria-required={required || undefined}
            accept={accept}
            multiple={isMultiple}
          />
          <span className={styles.label} aria-hidden="true">
            {label}
          </span>
        </div>
      )}

      {files.length > 0 && (
        <div className={styles.infor}>
          <ul className={styles.inforDiv} style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${index}`} className={styles.fileInfo}>
                {allowPreview ? (
                  <button type="button" onClick={() => preview(file)} className={styles.fileName}>
                    {`${getFileTypeLabel(file.type)}: ${file.name}`}
                  </button>
                ) : (
                  <span className={styles.fileName}>{`${getFileTypeLabel(file.type)}: ${file.name}`}</span>
                )}
                <div className={styles.uploadRemove}>
                  <p>{formatFileSize(file.size)}</p>
                  <IconButton icon="refresh" onClick={() => void replaceAt(index)} color={color ?? "var(--irt-color-primary)"} label={`Replace ${file.name}`} />
                  <IconButton icon="close" onClick={() => removeAt(index)} color="var(--irt-color-danger)" label={`Remove ${file.name}`} />
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <p className={styles.fileCount} aria-live="polite">
              {limited ? `(Files Uploaded: ${files.length} / ${maxFiles})` : `(Files Uploaded: ${files.length})`}
            </p>
            <button type="button" className={styles.buttonLink} onClick={reset}>
              Reset All
            </button>
            {isMultiple && files.length < maxFiles && (
              <button
                type="button"
                className={styles.buttonLink}
                onClick={() => void pickFiles({ accept, multiple: true }).then(addFiles)}
              >
                Add More Files
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
