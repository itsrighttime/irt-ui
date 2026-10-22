"use client";

import { useEffect, useRef } from "react";

/** Calls `handler` when Escape is pressed while `enabled`. */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled = true): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") handlerRef.current(event);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [enabled]);
}
