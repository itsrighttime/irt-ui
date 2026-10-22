"use client";

import { useRef, useState, type ReactNode } from "react";
import { DropdownSimple, type DropdownItem } from "../../../atoms/Selection/DropdownSimple";
import { Popover } from "../../../atoms/Overlay/Popover";

export interface TabDropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect?: (key: string | number) => void;
  offset?: number;
  /** Accessible menu name. */
  ariaLabel?: string;
}

/** Tab that opens a `DropdownSimple` menu. */
export function TabDropdown({ trigger, items, onSelect, offset, ariaLabel }: TabDropdownProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        ref={anchorRef}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ display: "inline-block" }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      <Popover anchorRef={anchorRef} isOpen={isOpen} onClose={() => setIsOpen(false)} offset={offset}>
        <DropdownSimple
          items={items}
          isOpen={isOpen}
          ariaLabel={ariaLabel}
          onSelect={(key) => {
            onSelect?.(key);
            setIsOpen(false);
          }}
        />
      </Popover>
    </>
  );
}
