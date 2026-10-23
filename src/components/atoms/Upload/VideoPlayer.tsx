"use client";

import { cssVars } from "../../../utils/cssVars";
import { IconButton } from "../Button/IconButton";
import { IconError } from "../ErrorPage/IconError";
import { useObjectUrl } from "./useObjectUrl";
import style from "./VideoPlayer.module.css";

export interface VideoPlayerProps {
  /** Video `File`/`Blob` or URL. */
  videoFile: File | Blob | string | null;
  onRemove?: () => void;
  onReupload?: () => void;
  color?: string;
  /** @default "400px" */
  width?: string;
  /** @default "200px" */
  height?: string;
  /** @default true */
  autoPlay?: boolean;
  /** @default true */
  muted?: boolean;
  /** Message shown when there is no playable source. @default "Video not available" */
  emptyText?: string;
  className?: string;
}

/** Video preview with native controls and optional replace/remove actions. */
export function VideoPlayer({
  videoFile,
  onRemove,
  onReupload,
  color,
  width = "400px",
  height = "200px",
  autoPlay = true,
  muted = true,
  emptyText = "Video not available",
  className,
}: VideoPlayerProps) {
  // Object URLs are created once per file and revoked on change/unmount (fixes a per-render leak).
  const src = useObjectUrl(videoFile);

  return (
    <div
      className={className ? `${style.videoContainer} ${className}` : style.videoContainer}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width, "--irt-c-height": height })}
    >
      {src ? (
        <div className={style.videoPreview}>
          <video controls controlsList="nodownload" muted={muted} autoPlay={autoPlay} src={src} className={style.videoPlayer} />
          {(onReupload || onRemove) && (
            <div className={style.resetRemove}>
              {onReupload && (
                <IconButton icon="refresh" variant="solid" shape="circle" color="var(--irt-color-surface-raised)" className={style.overlayButton} onClick={onReupload} label="Re-Upload" />
              )}
              {onRemove && (
                <IconButton icon="close" variant="solid" shape="circle" color="var(--irt-color-surface-raised)" className={style.overlayButton} onClick={onRemove} label="Remove video" />
              )}
            </div>
          )}
        </div>
      ) : (
        <IconError icon="videoOff" message={emptyText} size={2} />
      )}
    </div>
  );
}
