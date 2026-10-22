"use client";

import { useEffect, useState } from "react";

/**
 * Returns a URL for a `File`/`Blob` (revoked automatically) or passes a
 * string URL through. `null` for empty input.
 */
export function useObjectUrl(source: File | Blob | string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(typeof source === "string" ? source : null);

  useEffect(() => {
    if (!source) {
      setUrl(null);
      return;
    }
    if (typeof source === "string") {
      setUrl(source);
      return;
    }
    const objectUrl = URL.createObjectURL(source);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [source]);

  return url;
}
