"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  version as reactVersion,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type Ref,
} from "react";
import { useSmartPosition } from "../../../hooks/useSmartPosition";
import { useTheme } from "../../../theme/useTheme";
import { cssVars } from "../../../utils/cssVars";
import { mergeRefs } from "../../../utils/mergeRefs";
import { Popover } from "../Overlay/Popover";
import styles from "./Tooltip.module.css";
import type { TooltipProps } from "./Tooltip.types";

export type { TooltipProps } from "./Tooltip.types";

interface TriggerProps {
  ref?: Ref<HTMLElement>;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "aria-describedby"?: string;
}

const REACT_MAJOR = Number.parseInt(reactVersion, 10);

/** Reads a child's ref in both React 18 (`element.ref`) and 19 (`props.ref`). */
function getElementRef(element: ReactElement<TriggerProps>): Ref<HTMLElement> | undefined {
  if (REACT_MAJOR >= 19) return element.props.ref;
  return (element as unknown as { ref?: Ref<HTMLElement> }).ref;
}

/** Shows `content` next to its child on hover (after `delay`) and immediately on focus. */
export function Tooltip({ children, content, color, backgroundColor, width, delay }: TooltipProps) {
  const { theme } = useTheme();
  const tooltipId = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const position = useSmartPosition(tooltipRef, isOpen);

  const hoverDelay = delay ?? theme.components.tooltip.delay;
  const hasContent = content !== null && content !== undefined && content !== false && content !== "";

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  const open = () => setIsOpen(true);
  const openWithDelay = () => {
    clearTimer();
    if (hoverDelay <= 0) open();
    else timerRef.current = setTimeout(open, hoverDelay);
  };
  const close = () => {
    clearTimer();
    setIsOpen(false);
  };

  useEffect(() => clearTimer, []);

  if (!hasContent || !isValidElement<TriggerProps>(children)) return <>{children}</>;

  const child = children;
  const trigger = cloneElement(child, {
    ref: mergeRefs(anchorRef, getElementRef(child)),
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      child.props.onMouseEnter?.(event);
      openWithDelay();
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      child.props.onMouseLeave?.(event);
      close();
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      child.props.onFocus?.(event);
      // Only keyboard focus opens the tooltip — not programmatic focus (e.g. a
      // dialog focusing its close button) or a mouse click.
      let keyboard = true;
      try {
        keyboard = event.currentTarget.matches(":focus-visible");
      } catch {
        /* selector unsupported (old browsers / jsdom) */
      }
      if (keyboard) open();
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      child.props.onBlur?.(event);
      close();
    },
    "aria-describedby": isOpen
      ? [child.props["aria-describedby"], tooltipId].filter(Boolean).join(" ")
      : child.props["aria-describedby"],
  });

  return (
    <>
      {trigger}
      <Popover anchorRef={anchorRef} isOpen={isOpen} onClose={close} offset={0} closeOnOutsideClick={false}>
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={styles.tooltip}
          data-vertical={position.vertical}
          data-horizontal={position.horizontal}
          data-ready={position.ready}
          style={cssVars({
            "--irt-c-width": width ?? theme.components.tooltip.maxWidth,
            "--irt-c-color": color,
            "--irt-c-background": backgroundColor,
          })}
        >
          {content}
        </div>
      </Popover>
    </>
  );
}
