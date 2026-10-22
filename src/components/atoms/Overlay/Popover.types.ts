import type { CSSProperties, ReactNode, RefObject } from "react";
import type { PopoverPlacement } from "./usePopoverPosition";

export interface PopoverBaseProps {
  /** Element the popover is positioned against. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Whether the popover is shown. */
  isOpen: boolean;
  /** Called on outside click or Escape. */
  onClose: () => void;
  /** Gap between anchor and popover in px. */
  offset?: number;
  /** Close when clicking outside. @default true */
  closeOnOutsideClick?: boolean;
  /** Close on Escape. @default true */
  closeOnEscape?: boolean;
  className?: string;
  style?: CSSProperties;
  /** ARIA role of the floating element (e.g. `"dialog"`, `"listbox"`, `"tooltip"`). */
  role?: string;
  id?: string;
}

export interface PopoverProps extends PopoverBaseProps {
  children: ReactNode;
  /** Flip above the anchor when there's no room below. @default false */
  flip?: boolean;
}

export interface DynamicPopoverProps extends PopoverBaseProps {
  /** Render prop receiving the resolved placement. */
  children: (args: { placement: PopoverPlacement }) => ReactNode;
}
