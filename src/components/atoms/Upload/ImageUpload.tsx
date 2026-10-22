"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import { pickFiles } from "./pickFiles";
import { useObjectUrl } from "./useObjectUrl";
import style from "./ImageUpload.module.css";
import shared from "./Upload.module.css";
import { UploadDropzone, UploadFieldHeader, uploadHint } from "./UploadDropzone";

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
  /** Text inside the drop zone. @default "Drop an image here" */
  dropzoneText?: ReactNode;
  /** Hint under the drop zone text. @default derived from types / size */
  hint?: ReactNode;
  /** Helper text under the field. */
  helperText?: ReactNode;
  /** Preview object-fit. @default "cover" */
  fit?: "cover" | "contain";
  disabled?: boolean;
  className?: string;
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
  dropzoneText = "Drop an image here",
  hint,
  helperText,
  fit = "cover",
  disabled = false,
  className,
}: ImageUploadProps) {
  const messageId = useId();
  const [selected, setSelected] = useState<File | Blob | string | null>(value);
  const [error, setError] = useState<string | null>(null);
  const image = useObjectUrl(selected);
  const validRef = useRef(setIsFieldValid);
  useEffect(() => {
    validRef.current = setIsFieldValid;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-sync from the value prop
    setSelected(value);
    setError(null);
  }, [value]);

  useEffect(() => {
    if (backendError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror an external error prop
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

  const resolvedHint = hint ?? [uploadHint({ types: allowedTypes, maxSizeMb }), requireSquare ? "square" : undefined].filter(Boolean).join(" · ");
  const message = error ?? helperText;

  return (
    <div
      className={cx(shared.field, className)}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height === "auto" ? undefined : height })}
    >
      <UploadFieldHeader label={label} required={required} />

      {!image && (
        <UploadDropzone
          inputLabel={label}
          title={dropzoneText}
          hint={resolvedHint}
          icon="image"
          accept={accept}
          required={required}
          invalid={Boolean(error)}
          disabled={disabled}
          describedBy={message ? messageId : undefined}
          onFiles={(files) => void handleFile(files[0])}
        />
      )}

      {image && (
        <div className={style.imagePreview}>
          <img src={image} alt={label} className={style.image} style={{ borderRadius: previewBorderRadius, objectFit: fit }} />
          <div className={style.resetRemove}>
            <IconButton
              icon="refresh"
              variant="solid"
              shape="circle"
              color="var(--irt-color-surface-raised)"
              onClick={() => void pickFiles({ accept }).then((files) => handleFile(files[0]))}
              label="Re-Upload"
              disabled={disabled}
              className={style.overlayButton}
            />
            <IconButton
              icon="close"
              variant="solid"
              shape="circle"
              color="var(--irt-color-surface-raised)"
              onClick={reset}
              label="Remove image"
              disabled={disabled}
              className={style.overlayButton}
            />
          </div>
        </div>
      )}

      {message && (
        <p id={messageId} className={error ? shared.error : shared.message} role={error ? "alert" : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
