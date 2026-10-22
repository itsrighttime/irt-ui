"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import { formatFileSize } from "./formatFileSize.helper";
import { pickFiles } from "./pickFiles";
import { useDropZone } from "./useDropZone";
import { VideoPlayer } from "./VideoPlayer";
import style from "./VideoUpload.module.css";

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
}: VideoUploadProps) {
  const [video, setVideo] = useState<File | Blob | string | null>(value);
  const [error, setError] = useState<string | null>(null);
  const validRef = useRef(setIsFieldValid);
  validRef.current = setIsFieldValid;

  const maxBytes = maxSizeMb * 1024 * 1024;
  const maxLabel = formatFileSize(maxBytes);
  const accept = allowedTypes.join(",");

  useEffect(() => {
    setVideo(value);
    setError(null);
  }, [value]);

  useEffect(() => {
    if (backendError) {
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
  const { isDragging, handlers } = useDropZone<HTMLDivElement>((files) => handleFile(files[0]));

  return (
    <div
      className={style.videoUploadContainer}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height })}
    >
      {label && <p className={style.label}>{label}</p>}
      {required && (
        <p className={style.required} aria-hidden="true">
          *
        </p>
      )}

      {!video && (
        <div className={cx(style.videoUpload, isDragging && style.dragging)} {...handlers}>
          <input
            type="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
            className={style.formControl}
            accept={accept}
            aria-label={label}
            aria-required={required || undefined}
          />
          <span className={style.label}>{label}</span>
          <span className={style.label}>{`(Max Size: ${maxLabel})`}</span>
        </div>
      )}

      {video && !preview && (
        <div className={style.uploadDetails}>
          <p>Video Uploaded: {video instanceof File ? video.name : "Uploaded Video"}</p>
          <div className={style.videoSizeIcon}>
            {video instanceof File && <p>{formatFileSize(video.size)}</p>}
            <IconButton icon="refresh" onClick={reupload} color={color ?? "var(--irt-color-primary)"} label="Re-Upload" />
            <IconButton icon="close" onClick={remove} color="var(--irt-color-danger)" label="Remove video" />
          </div>
        </div>
      )}

      {video && preview && (
        <VideoPlayer videoFile={video} onRemove={remove} onReupload={reupload} color={color} width="100%" height="auto" />
      )}

      {error && (
        <p className={style.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
