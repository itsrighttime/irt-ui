"use client";

import { PopoverCore } from "./Popover";
import type { DynamicPopoverProps } from "./Popover.types";

/**
 * Popover that flips above its anchor when there's no room below and tells
 * its children the final placement via a render prop.
 */
export function DynamicPopover({ children, offset = 0, ...props }: DynamicPopoverProps) {
  return (
    <PopoverCore {...props} offset={offset} flip render={(placement) => children({ placement })} />
  );
}
