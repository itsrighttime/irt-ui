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

/** Tab that opens a `DropdownSimple` menu (focuses the first item; Escape returns focus). */
export function TabDropdown({ trigger, items, onSelect, offset = 4, ariaLabel }: TabDropdownProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
    anchorRef.current?.querySelector<HTMLElement>("button, [tabindex]")?.focus();
  };

  const toggle = () => {
    setIsOpen((prev) => {
      if (!prev) {
        requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("[role=menuitem]:not(:disabled)")?.focus());
      }
      return !prev;
    });
  };

  return (
    <>
      <div
        ref={anchorRef}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !isOpen) {
            event.preventDefault();
            toggle();
          }
        }}
        style={{ display: "inline-flex" }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      <Popover anchorRef={anchorRef} isOpen={isOpen} onClose={() => setIsOpen(false)} offset={offset} style={{ width: "auto" }}>
        <div ref={menuRef}>
          <DropdownSimple
            items={items}
            isOpen={isOpen}
            ariaLabel={ariaLabel}
            onClose={close}
            onSelect={(key) => {
              onSelect?.(key);
              close();
            }}
          />
        </div>
      </Popover>
    </>
  );
}
