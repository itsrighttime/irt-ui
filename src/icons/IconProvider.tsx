"use client";

import { useContext, useMemo, type ReactNode } from "react";
import { IconContext, type IconContextValue } from "./IconContext";
import type { IconOverrides } from "./registry";

export interface IconProviderProps {
  /** Replace registry icons by semantic name, e.g. `{ close: MyCloseIcon }`. */
  icons?: IconOverrides;
  /** Default `size` for icons that don't specify one. */
  size?: number | string;
  /** Default `strokeWidth`. */
  strokeWidth?: number | string;
  /** Default `color`. @default "currentColor" */
  color?: string;
  children?: ReactNode;
}

/** Overrides icon implementations/defaults for its subtree. Nested providers merge. */
export function IconProvider({ icons, size, strokeWidth, color, children }: IconProviderProps) {
  const parent = useContext(IconContext);
  const value = useMemo<IconContextValue>(
    () => ({
      overrides: { ...parent.overrides, ...icons },
      defaults: {
        ...parent.defaults,
        ...(size !== undefined && { size }),
        ...(strokeWidth !== undefined && { strokeWidth }),
        ...(color !== undefined && { color }),
      },
    }),
    [parent, icons, size, strokeWidth, color],
  );
  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}
