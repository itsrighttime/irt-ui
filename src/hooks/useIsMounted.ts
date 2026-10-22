"use client";

import { useEffect, useState } from "react";

/**
 * `false` during SSR and the first client render, `true` afterwards.
 * Use it to defer portals / browser-only markup and avoid hydration mismatches.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
