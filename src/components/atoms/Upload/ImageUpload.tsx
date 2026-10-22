"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import { pickFiles } from "./pickFiles";
import { useDropZone } from "./useDropZone";
import { useObjectUrl } from "./useObjectUrl";
import style from "./ImageUpload.module.css";

export interface ImageUploadProps {
  /** @default "Upload Image" */
  label?: string;
  setResult: (file: File | null) => void;
  color?: string;
  setIsFieldValid?: (isValid: boolean) => void;
  /** @default ["image/jpeg", "image/png", "image/gif"] */
  allowedTypes?: string[];
  /** @default 5 */
  maxSizeMb?: number;
  /** Reject non-square images. @default true */
  requireSquare?: boolean;
  /** @default "300px" */
  width?: string;
  /** @default "auto" */
  height?: string;
  /** @default var(--irt-radius-md) */
  previewBorderRadius?: string;
  /** Server-side error message. */
  backendError?: string;
  /** Existing image (URL or file). */
  value?: File | Blob | string | null;
  required?: boolean;
}

const DEFAULT_TYPES = ["image/jpeg", "image/png", "image/gif"];

const isSquareImage = (url: string): Promise<boolean> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === img.height);
    img.onerror = () => resolve(false);
    img.src = url;
  });

/** Single image upload with type/size/square validation and preview. */
export function ImageUpload({
  label = "Upload Image",
  setResult,
  color,
  setIsFieldValid,
  allowedTypes = DEFAULT_TYPES,
  maxSizeMb = 5,
  requireSquare = true,
  width = "300px",
  height = "auto",
  previewBorderRadius = "var(--irt-radius-md)",
  backendError = "",
  value = null,
  required = false,
}: ImageUploadProps) {
  const [selected, setSelected] = useState<File | Blob | string | null>(value);
  const [error, setError] = useState<string | null>(null);
  const image = useObjectUrl(selected);
  const validRef = useRef(setIsFieldValid);
  validRef.current = setIsFieldValid;

  useEffect(() => {
    setSelected(value);
    setError(null);
  }, [value]);

  useEffect(() => {
    if (backendError) {
      setError(backendError);
      validRef.current?.(false);
    }
  }, [backendError]);

  const accept = allowedTypes.join(",");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid image type. Allowed types: ${allowedTypes.join(", ")}`);
      validRef.current?.(false);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image size exceeds limit of ${maxSizeMb} MB`);
      validRef.current?.(false);
      return;
    }
    if (requireSquare) {
      const probe = URL.createObjectURL(file);
      const square = await isSquareImage(probe);
      URL.revokeObjectURL(probe);
      if (!square) {
        setError("Image must be square. Please reupload.");
        reset();
        return;
      }
    }
    setSelected(file);
    setResult(file);
    validRef.current?.(true);
    setError(null);
  };

  const reset = () => {
    setSelected(null);
    setResult(null);
    validRef.current?.(false);
  };

  const { isDragging, handlers } = useDropZone<HTMLLabelElement>((files) => void handleFile(files[0]));

  return (
    <div
      className={style.imageUploadContainer}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height })}
    >
      {label && <p className={style.label}>{label}</p>}
      {required && (
        <p className={style.required} aria-hidden="true">
          *
        </p>
      )}

      {!image && (
        <label className={cx(style.imageUpload, isDragging && style.dragging)} {...handlers}>
          <input
            type="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
            className={style.formControl}
            accept={accept}
            aria-required={required || undefined}
          />
          <span className={style.label}>{label}</span>
          <span className={style.label}>{`(Max Size: ${maxSizeMb}MB)`}</span>
        </label>
      )}

      {image && (
        <div className={style.imagePreview}>
          <img src={image} alt={label} className={style.image} style={{ borderRadius: previewBorderRadius, width: "100%", height: "auto" }} />
          <div className={style.resetRemove}>
            <IconButton
              icon="refresh"
              onClick={() => void pickFiles({ accept }).then((files) => handleFile(files[0]))}
              color={color ?? "var(--irt-color-primary)"}
              label="Re-Upload"
            />
            <IconButton icon="close" onClick={reset} color="var(--irt-color-danger)" label="Remove image" />
          </div>
        </div>
      )}

      {error && (
        <p className={style.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
