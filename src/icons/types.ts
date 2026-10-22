import type { ComponentType, SVGProps } from "react";

/** Props every icon component (built-in or custom) must accept. */
export interface IconSvgProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
}

/** An icon implementation. Lucide icons and any SVG component with `IconSvgProps` qualify. */
export type IconComponent = ComponentType<IconSvgProps>;
