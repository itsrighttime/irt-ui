"use client";

import type { IconNameInput } from "../../../../icons/legacyAliases";
import { IconButton } from "../../../atoms/Button/IconButton";

export interface TabIconProps {
  icon: IconNameInput;
  onClick?: () => void;
  label?: string;
  isActive?: boolean;
}

/** Icon tab with an active underline. */
export function TabIcon({ icon, onClick, label, isActive = false }: TabIconProps) {
  return (
    <div
      aria-current={isActive ? "page" : undefined}
      style={{ borderBottom: isActive ? "var(--irt-border-width-thick) solid var(--irt-color-primary)" : "none" }}
    >
      <IconButton icon={icon} size={1.5} onClick={onClick} label={label} />
    </div>
  );
}
