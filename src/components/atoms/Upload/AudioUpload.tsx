"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { AudioPlayer } from "./AudioPlayer";
import { pickFiles } from "./pickFiles";
import { useObjectUrl } from "./useObjectUrl";
import shared from "./Upload.module.css";
import { UploadDropzone, UploadFieldHeader, uploadHint } from "./UploadDropzone";

export interface AudioUploadProps {
  label?: string;
  setResult: (file: File | null) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  /** @default ["audio/mpeg", "audio/wav"] */
  allowedTypes?: string[];
  /** @default 10 */
  maxSizeMb?: number;
  /** @default "300px" */
  width?: string;
  /** @default "100px" */
  height?: string;
  value?: string | File | Blob | null;
  backendError?: string;
  required?: boolean;
  /** Text inside the drop zone. @default "Drop an audio file here" */
  dropzoneText?: ReactNode;
  /** Hint under the drop zone text. @default derived from types / size */
  hint?: ReactNode;
  /** Helper text under the field. */
  helperText?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_TYPES = ["audio/mpeg", "audio/wav"];

/** Single audio upload with validation and a built-in player. */
export function AudioUpload({
  label,
  setResult,
  color,
  setIsFieldValid,
  allowedTypes = DEFAULT_TYPES,
  maxSizeMb = 10,
  width = "300px",
  height = "100px",
  backendError = "",
  value = null,
  required = false,
  dropzoneText = "Drop an audio file here",
  hint,
  helperText,
  disabled = false,
  className,
}: AudioUploadProps) {
  const messageId = useId();
  const [source, setSource] = useState<string | File | Blob | null>(value);
  const [error, setError] = useState<string | null>(null);
  const audio = useObjectUrl(source);
  const validRef = useRef(setIsFieldValid);
  useEffect(() => {
    validRef.current = setIsFieldValid;
  });
  const accept = allowedTypes.join(",");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-sync from the value prop
    setSource(value);
    setError(null);
  }, [value]);

  useEffect(() => {
    if (backendError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror an external error prop
      setError(backendError);
      validRef.current?.(false);
    }
  }, [backendError]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid audio type. Allowed types: ${allowedTypes.join(", ")}`);
      validRef.current?.(false);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Audio size exceeds limit of ${maxSizeMb} MB`);
      validRef.current?.(false);
      return;
    }
    setError(null);
    setSource(file);
    setResult(file);
    validRef.current?.(true);
  };

  const remove = () => {
    setSource(null);
    setResult(null);
    validRef.current?.(false);
  };

  const vars = cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height });
  const message = error ?? helperText;

  return (
    <div className={cx(shared.field, className)} style={vars}>
      <UploadFieldHeader label={label} required={required} />

      {!audio ? (
        <UploadDropzone
          inputLabel={label ?? "Upload audio"}
          title={dropzoneText}
          hint={hint ?? uploadHint({ types: allowedTypes, maxSizeMb })}
          icon="music"
          accept={accept}
          required={required}
          invalid={Boolean(error)}
          disabled={disabled}
          compact
          describedBy={message ? messageId : undefined}
          onFiles={(files) => handleFile(files[0])}
        />
      ) : (
        <AudioPlayer
          audioSrc={audio}
          onRemove={remove}
          onReupload={() => void pickFiles({ accept }).then((files) => handleFile(files[0]))}
          color={color}
          width="100%"
        />
      )}
      {message && (
        <p id={messageId} className={error ? shared.error : shared.message} role={error ? "alert" : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
