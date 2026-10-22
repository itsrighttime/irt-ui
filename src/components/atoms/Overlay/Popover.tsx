"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { usePortalContainer } from "../../../theme/useTheme";
import { usePopoverPosition, type PopoverPlacement } from "./usePopoverPosition";
import type { PopoverBaseProps, PopoverProps } from "./Popover.types";

interface PopoverCoreProps extends PopoverBaseProps {
  flip: boolean;
  render: (placement: PopoverPlacement) => ReactNode;
}

/** Shared implementation for `Popover` and `DynamicPopover`. @internal */
export function PopoverCore({
  anchorRef,
  isOpen,
  onClose,
  offset = 4,
  flip,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  className,
  style,
  role,
  id,
  render,
}: PopoverCoreProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const container = usePortalContainer();
  const mounted = useIsMounted();
  const position = usePopoverPosition(anchorRef, popoverRef, isOpen, { offset, flip });

  useClickOutside([popoverRef, anchorRef], onClose, isOpen && closeOnOutsideClick);
  useEscapeKey(onClose, isOpen && closeOnEscape);

  // Portals render only after mount so SSR and hydration markup match.
  if (!isOpen || !mounted || !container) return null;

  return createPortal(
    <div
      ref={popoverRef}
      id={id}
      role={role}
      className={className}
      data-placement={position.placement}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: "var(--irt-z-popover)",
        ...style,
      }}
    >
      {render(position.placement)}
    </div>,
    container,
  );
}

/**
 * Floating panel anchored below `anchorRef`, rendered in a portal.
 * Closes on outside click and Escape.
 */
export function Popover({ children, flip = false, ...props }: PopoverProps) {
  return <PopoverCore {...props} flip={flip} render={() => children} />;
}
