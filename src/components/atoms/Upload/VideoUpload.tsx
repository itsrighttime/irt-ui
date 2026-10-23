"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "../../../icons/Icon";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import { formatFileSize } from "./formatFileSize.helper";
import { pickFiles } from "./pickFiles";
import { VideoPlayer } from "./VideoPlayer";
import shared from "./Upload.module.css";
import { UploadDropzone, UploadFieldHeader, uploadHint } from "./UploadDropzone";

export interface VideoUploadProps {
  /** @default "Upload Video" */
  label?: string;
  color?: string;
  setResult: (file: File | null) => void;
  /** `null` after removal. */
  setIsFieldValid?: (isValid: boolean | null) => void;
  /** @default ["video/mp4", "video/webm"] */
  allowedTypes?: string[];
  /** @default 50 */
  maxSizeMb?: number;
  /** Show a player instead of the file summary. @default false */
  preview?: boolean;
  /** @default "300px" */
  width?: string;
  /** @default "200px" */
  height?: string;
  backendError?: string;
  value?: File | Blob | string | null;
  required?: boolean;
  /** Text inside the drop zone. @default "Drop a video here" */
  dropzoneText?: ReactNode;
  /** Hint under the drop zone text. @default derived from types / size */
  hint?: ReactNode;
  /** Helper text under the field. */
  helperText?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_TYPES = ["video/mp4", "video/webm"];

/** Single video upload with validation and optional preview. */
export function VideoUpload({
  label = "Upload Video",
  color,
  setResult,
  setIsFieldValid,
  allowedTypes = DEFAULT_TYPES,
  maxSizeMb = 50,
  preview = false,
  width = "300px",
  height = "200px",
  backendError,
  value = null,
  required = false,
  dropzoneText = "Drop a video here",
  hint,
  helperText,
  disabled = false,
  className,
}: VideoUploadProps) {
  const messageId = useId();
  const [video, setVideo] = useState<File | Blob | string | null>(value);
  const [error, setError] = useState<string | null>(null);
  const validRef = useRef(setIsFieldValid);
  useEffect(() => {
    validRef.current = setIsFieldValid;
  });

  const maxBytes = maxSizeMb * 1024 * 1024;
  const maxLabel = formatFileSize(maxBytes);
  const accept = allowedTypes.join(",");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-sync from the value prop
    setVideo(value);
    setError(null);
  }, [value]);

  useEffect(() => {
    if (backendError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror an external error prop
      setError(backendError);
      validRef.current?.(false);
    }
  }, [backendError]);

  const validate = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid video type. Allowed types: ${allowedTypes.join(", ")}`);
      return false;
    }
    if (file.size > maxBytes) {
      setError(`Video size exceeds limit of ${maxLabel}`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (validate(file)) {
      setVideo(file);
      setResult(file);
      validRef.current?.(true);
    } else {
      setVideo(null);
      setResult(null);
      validRef.current?.(false);
    }
  };

  const remove = () => {
    setVideo(null);
    setResult(null);
    validRef.current?.(null);
  };

  const reupload = () => void pickFiles({ accept }).then((files) => handleFile(files[0]));
  const message = error ?? helperText;

  return (
    <div
      className={cx(shared.field, className)}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height })}
    >
      <UploadFieldHeader label={label} required={required} />

      {!video && (
        <UploadDropzone
          inputLabel={label}
          title={dropzoneText}
          hint={hint ?? uploadHint({ types: allowedTypes, maxSizeMb })}
          icon="video"
          accept={accept}
          required={required}
          invalid={Boolean(error)}
          disabled={disabled}
          describedBy={message ? messageId : undefined}
          onFiles={(files) => handleFile(files[0])}
        />
      )}

      {video && !preview && (
        <div className={shared.fileRow}>
          <span className={shared.fileIcon} aria-hidden="true">
            <Icon name="video" size="1.05em" />
          </span>
          <span className={shared.fileMeta}>
            <span className={shared.fileName}>{video instanceof File ? video.name : "Uploaded video"}</span>
            <span className={shared.fileDetails}>{video instanceof File ? formatFileSize(video.size) : "Video"}</span>
          </span>
          <span className={shared.rowActions}>
            <IconButton icon="refresh" onClick={reupload} color="var(--irt-color-text-muted)" label="Re-Upload" disabled={disabled} />
            <IconButton icon="close" onClick={remove} color="var(--irt-color-danger)" label="Remove video" disabled={disabled} />
          </span>
        </div>
      )}

      {video && preview && (
        <VideoPlayer videoFile={video} onRemove={remove} onReupload={reupload} color={color} width="100%" height="auto" />
      )}

      {message && (
        <p id={messageId} className={error ? shared.error : shared.message} role={error ? "alert" : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
