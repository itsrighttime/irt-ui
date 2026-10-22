"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Calls `handler` on mousedown outside all given elements while `enabled`. */
export function useClickOutside(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  handler: (event: MouseEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const inside = refsRef.current.some((ref) => ref.current?.contains(target));
      if (!inside) handlerRef.current(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [enabled]);
}
