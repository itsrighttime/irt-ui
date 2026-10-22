import type { ReactNode } from "react";

export interface TooltipProps {
  /** Trigger element. A single element receives the hover/focus handlers directly. */
  children: ReactNode;
  /** Tooltip content. Nothing is rendered when empty. */
  content: ReactNode;
  /** Text colour. @default var(--irt-color-tooltip-text) */
  color?: string;
  /** Background colour. @default var(--irt-color-tooltip-background) */
  backgroundColor?: string;
  /** Max width. @default theme `components.tooltip.maxWidth` */
  width?: string;
  /** Hover delay in ms. @default theme `components.tooltip.delay` (1500) */
  delay?: number;
}
