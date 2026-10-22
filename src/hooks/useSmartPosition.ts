"use client";

import { useEffect, useState, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export interface SmartPosition {
  /** Side on the vertical axis. */
  vertical: "top" | "bottom";
  /** Side on the horizontal axis. */
  horizontal: "left" | "right";
  /** `false` until the element has been measured — hide it until then. */
  ready: boolean;
}

const INITIAL: SmartPosition = { vertical: "bottom", horizontal: "right", ready: false };

/**
 * Measures a floating element (rendered in its default bottom/right placement)
 * after it opens and flips it when it would overflow the viewport.
 * Re-measures on window resize and scroll.
 *
 * Re-implementation of the host-app `@/hooks` `useSmartPosition` contract:
 * `useSmartPosition(ref, isOpen) → { vertical, horizontal, ready }`.
 */
export function useSmartPosition(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  margin = 8,
): SmartPosition {
  const [position, setPosition] = useState<SmartPosition>(INITIAL);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) {
      setPosition((prev) => (prev === INITIAL ? prev : INITIAL));
      return;
    }
    if (position.ready) return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const overflowBottom = rect.bottom + margin > window.innerHeight;
    const fitsTop = rect.top - rect.height - margin >= 0;
    const overflowRight = rect.right + margin > window.innerWidth;
    const fitsLeft = rect.left - rect.width - margin >= 0;

    setPosition({
      vertical: overflowBottom && fitsTop ? "top" : "bottom",
      horizontal: overflowRight && fitsLeft ? "left" : "right",
      ready: true,
    });
  }, [isOpen, position.ready, ref, margin]);

  useEffect(() => {
    if (!isOpen) return;
    const remeasure = () => setPosition(INITIAL);
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, true);
    return () => {
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure, true);
    };
  }, [isOpen]);

  return position;
}
