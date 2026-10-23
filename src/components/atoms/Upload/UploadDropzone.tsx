"use client";

import type { ChangeEvent, ReactNode } from "react";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cx } from "../../../utils/cx";
import styles from "./Upload.module.css";
import { useDropZone } from "./useDropZone";

interface UploadDropzoneProps {
  /** Accessible name of the file input. */
  inputLabel: string;
  /** Main line, e.g. "Upload documents". */
  title: ReactNode;
  /** Secondary line, e.g. "PDF up to 5 MB". */
  hint?: ReactNode;
  icon?: IconLike;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** Compact single-row layout (used by AudioUpload). */
  compact?: boolean;
  describedBy?: string;
  onFiles: (files: File[]) => void;
  className?: string;
}

/** Shared drag-and-drop target with a native (visually hidden) file input. @internal */
export function UploadDropzone({
  inputLabel,
  title,
  hint,
  icon = "cloudUpload",
  accept,
  multiple = false,
  required = false,
  invalid = false,
  disabled = false,
  compact = false,
  describedBy,
  onFiles,
  className,
}: UploadDropzoneProps) {
  const { isDragging, handlers } = useDropZone<HTMLDivElement>(onFiles);
  return (
    <div
      className={cx(
        styles.dropzone,
        compact && styles.compact,
        isDragging && styles.dragging,
        invalid && styles.invalid,
        disabled && styles.dropzoneDisabled,
        className,
      )}
      {...(disabled ? {} : handlers)}
    >
      <input
        type="file"
        className={styles.fileInput}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
        title=""
        aria-label={inputLabel}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
      />
      <span className={styles.dropIcon} aria-hidden="true">
        {renderIcon(icon, { size: "1.25em" })}
      </span>
      <span className={styles.dropText}>
        <span className={styles.dropTitle}>
          {title} <span className={styles.browse}>{isDragging ? "— drop to upload" : "or browse"}</span>
        </span>
        {hint && <span className={styles.dropHint}>{hint}</span>}
      </span>
    </div>
  );
}

interface UploadFieldHeaderProps {
  label?: string;
  required?: boolean;
  id?: string;
}

/** Field label row shared by the upload components. @internal */
export function UploadFieldHeader({ label, required, id }: UploadFieldHeaderProps) {
  if (!label) return null;
  return (
    <div id={id} className={styles.fieldLabel}>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </div>
  );
}

/** Builds a human hint like "PDF, PNG · up to 5 MB · max 3 files". @internal */
export function uploadHint(parts: { types?: string[]; maxSizeMb?: number; maxFiles?: number }): string | undefined {
  const out: string[] = [];
  if (parts.types && parts.types.length > 0) {
    out.push(
      parts.types
        .map((type) => (type.includes("/") ? (type.split("/")[1] ?? type) : type).replace(/^x-/, "").replace(/\+xml$/, "").toUpperCase())
        .join(", "),
    );
  }
  if (parts.maxSizeMb !== undefined && Number.isFinite(parts.maxSizeMb)) out.push(`up to ${parts.maxSizeMb} MB`);
  if (parts.maxFiles !== undefined && Number.isFinite(parts.maxFiles) && parts.maxFiles > 1) out.push(`max ${parts.maxFiles} files`);
  return out.length ? out.join(" · ") : undefined;
}
