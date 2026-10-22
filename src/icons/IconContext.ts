import { createContext } from "react";
import type { IconOverrides } from "./registry";
import type { IconSvgProps } from "./types";

export interface IconContextValue {
  overrides: IconOverrides;
  /** Default props for every icon (e.g. `strokeWidth`). */
  defaults: Pick<IconSvgProps, "size" | "strokeWidth" | "color">;
}

export const IconContext = createContext<IconContextValue>({ overrides: {}, defaults: {} });
IconContext.displayName = "IrtIconContext";
