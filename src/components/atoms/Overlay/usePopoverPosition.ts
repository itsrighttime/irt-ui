"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { useIsomorphicLayoutEffect } from "../../../hooks/useIsomorphicLayoutEffect";

export type PopoverPlacement = "top" | "bottom";

export interface PopoverPosition {
  top: number;
  left: number;
  width: number;
  placement: PopoverPlacement;
}

export interface UsePopoverPositionOptions {
  /** Gap between anchor and popover in px. */
  offset: number;
  /** Flip above the anchor when there is not enough room below. */
  flip: boolean;
}

/**
 * Computes a `position: fixed` location for a popover anchored under (or,
 * with `flip`, above) an element. Tracks scroll (any ancestor) and resize.
 */
export function usePopoverPosition(
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  { offset, flip }: UsePopoverPositionOptions,
): PopoverPosition {
  const [position, setPosition] = useState<PopoverPosition>({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom",
  });

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    let top = rect.bottom + offset;
    let placement: PopoverPlacement = "bottom";

    if (flip && popoverRef.current) {
      const height = popoverRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < height && spaceAbove > spaceBelow) {
        top = rect.top - height - offset;
        placement = "top";
      }
    }

    setPosition((prev) =>
      prev.top === top && prev.left === rect.left && prev.width === rect.width && prev.placement === placement
        ? prev
        : { top, left: rect.left, width: rect.width, placement },
    );
  }, [anchorRef, popoverRef, offset, flip]);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    update();
    // Second pass once the popover has rendered and has a measurable height.
    const frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [isOpen, update]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = () => update();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [isOpen, update]);

  return position;
}
