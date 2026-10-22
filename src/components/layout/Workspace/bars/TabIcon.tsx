"use client";

import type { IconNameInput } from "../../../../icons/legacyAliases";
import { IconButton } from "../../../atoms/Button/IconButton";

export interface TabIconProps {
  icon: IconNameInput;
  onClick?: () => void;
  label?: string;
  isActive?: boolean;
  disabled?: boolean;
  /** Icon colour override. By default inactive icons are muted and the active icon uses the primary colour. */
  color?: string;
}

/** Icon tab; the active tab gets a tinted background. */
export function TabIcon({ icon, onClick, label, isActive = false, disabled = false, color }: TabIconProps) {
  return (
    <span aria-current={isActive ? "page" : undefined} style={{ display: "inline-flex" }}>
      <IconButton
        icon={icon}
        size={1.2}
        onClick={onClick}
        label={label}
        disabled={disabled}
        color={color ?? (isActive ? "var(--irt-color-primary)" : "var(--irt-color-text-muted)")}
        variant={isActive ? "soft" : "ghost"}
      />
    </span>
  );
}
