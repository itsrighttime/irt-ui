"use client";

import { IconError } from "../ErrorPage/IconError";
import { useObjectUrl } from "./useObjectUrl";

export interface ImagePreviewProps {
  /** Image URL or `File`. */
  image: File | string | null;
  /** @default "8px" */
  radius?: string;
  /** @default "200px" */
  width?: string;
  /** @default "200px" */
  height?: string;
  /** @default "Preview" */
  alt?: string;
}

/** Shows an image from a URL or `File`, with a placeholder when missing/invalid. */
export function ImagePreview({ image, radius = "8px", width = "200px", height = "200px", alt = "Preview" }: ImagePreviewProps) {
  const isValidFile = image instanceof File ? image.type.startsWith("image/") : true;
  const url = useObjectUrl(isValidFile ? image : null);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--irt-color-surface-muted)",
        border: "var(--irt-border-width-thin) solid var(--irt-color-gray3)",
      }}
    >
      {url ? (
        <img src={url} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: radius }} />
      ) : (
        <IconError icon="imageOff" message="Ah! Looks like the image is not found." size={2} />
      )}
    </div>
  );
}
