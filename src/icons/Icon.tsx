"use client";

import { useContext, type CSSProperties } from "react";
import { IconContext } from "./IconContext";
import { iconRegistry } from "./registry";
import { resolveIconName, type IconNameInput } from "./legacyAliases";
import type { IconComponent, IconSvgProps } from "./types";

export interface IconProps extends Omit<IconSvgProps, "name"> {
  /** Semantic icon name (legacy `xxxIcon` names are accepted but deprecated). */
  name?: IconNameInput;
  /** Render a specific component instead of a registry entry. */
  as?: IconComponent;
  /** Pixel size or CSS length. @default 20 (theme `components.icon.size`) */
  size?: number | string;
  /** @default "currentColor" */
  color?: string;
  strokeWidth?: number | string;
  /** Accessible label. Without it the icon is decorative (`aria-hidden`). */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

const warned = new Set<string>();

/** Renders an icon from the central registry (or `IconProvider` overrides). */
export function Icon({ name, as, size, color, strokeWidth, label, ...rest }: IconProps) {
  const { overrides, defaults } = useContext(IconContext);

  let Component: IconComponent | undefined = as;
  if (!Component && name !== undefined) {
    const semantic = resolveIconName(name);
    Component = semantic ? (overrides[semantic] ?? iconRegistry[semantic]) : undefined;
  }

  if (!Component) {
    const key = String(name);
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(`[irt-ui] Unknown icon "${key}". Check the icon registry.`);
    }
    return null;
  }

  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const, focusable: "false" as const };

  return (
    <Component
      size={size ?? defaults.size ?? 20}
      color={color ?? defaults.color ?? "currentColor"}
      strokeWidth={strokeWidth ?? defaults.strokeWidth ?? 2}
      {...a11y}
      {...rest}
    />
  );
}
