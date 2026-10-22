"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { AudioPlayer } from "./AudioPlayer";
import { pickFiles } from "./pickFiles";
import { useDropZone } from "./useDropZone";
import { useObjectUrl } from "./useObjectUrl";
import style from "./AudioUpload.module.css";

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
}: AudioUploadProps) {
  const [source, setSource] = useState<string | File | Blob | null>(value);
  const [error, setError] = useState<string | null>(null);
  const audio = useObjectUrl(source);
  const validRef = useRef(setIsFieldValid);
  validRef.current = setIsFieldValid;
  const accept = allowedTypes.join(",");

  useEffect(() => {
    setSource(value);
    setError(null);
  }, [value]);

  useEffect(() => {
    if (backendError) {
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

  const { isDragging, handlers } = useDropZone<HTMLDivElement>((files) => handleFile(files[0]));
  const vars = cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height });

  return (
    <div className={style.audioUploadContainer} style={vars}>
      {label && <p className={style.label}>{label}</p>}
      {required && (
        <p className={style.required} aria-hidden="true">
          *
        </p>
      )}

      {!audio ? (
        <div className={cx(style.audioUpload, isDragging && style.dragging)} {...handlers}>
          <input
            type="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
            className={style.formControl}
            accept={accept}
            aria-label={label ?? "Upload audio"}
            aria-required={required || undefined}
          />
          <span className={style.label}>{label}</span>
          <span className={style.label}>{`(Max Size: ${maxSizeMb}MB)`}</span>
        </div>
      ) : (
        <AudioPlayer
          audioSrc={audio}
          onRemove={remove}
          onReupload={() => void pickFiles({ accept }).then((files) => handleFile(files[0]))}
          color={color}
          width="100%"
        />
      )}
      {error && (
        <p className={style.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
