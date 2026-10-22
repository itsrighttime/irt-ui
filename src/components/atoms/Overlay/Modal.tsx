"use client";

import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { usePortalContainer } from "../../../theme/useTheme";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import styles from "./Modal.module.css";

/** Preset widths of a {@link Modal}. */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full" | "auto";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Heading rendered in the modal header; also labels the dialog. */
  title?: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Footer content, typically action buttons (right-aligned). */
  footer?: ReactNode;
  /** Width preset. `auto` sizes to the content (legacy behaviour). @default "auto" */
  size?: ModalSize;
  /** Explicit width (any CSS length); overrides `size`. */
  width?: string;
  /** Accessible name of the dialog (when there is no `title`). */
  ariaLabel?: string;
  /** id of an element inside `children` that labels the dialog. */
  ariaLabelledBy?: string;
  /** @default true */
  closeOnOverlayClick?: boolean;
  /** @default true */
  closeOnEscape?: boolean;
  /** Show the close (×) button. @default true */
  showCloseButton?: boolean;
  /** Prevent the page behind from scrolling while open. @default true */
  lockScroll?: boolean;
  /** Class for the overlay (backdrop). */
  className?: string;
  /** Class for the dialog panel. */
  contentClassName?: string;
  /** Style for the overlay (backdrop). */
  style?: CSSProperties;
}

/**
 * Centered modal dialog rendered in a portal with focus trap, Escape and
 * overlay-click handling, scroll lock, and optional header/footer.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  footer,
  size = "auto",
  width,
  ariaLabel,
  ariaLabelledBy,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  lockScroll = true,
  className,
  contentClassName,
  style,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pressStartedInside = useRef(false);
  const container = usePortalContainer();
  const mounted = useIsMounted();
  const titleId = useId();
  const descriptionId = useId();

  useEscapeKey(onClose, isOpen && closeOnEscape);
  useFocusTrap(contentRef, isOpen && mounted);
  useScrollLock(isOpen && mounted && lockScroll);

  if (!isOpen || !mounted || !container) return null;

  const hasHeader = title != null || description != null;

  return createPortal(
    <div
      className={cx(styles.overlay, className)}
      style={style}
      onMouseDown={(event) => {
        pressStartedInside.current = event.target !== event.currentTarget;
      }}
      onClick={(event) => {
        // Ignore clicks that started inside the panel (e.g. text selection drags).
        const startedInside = pressStartedInside.current;
        pressStartedInside.current = false;
        if (closeOnOverlayClick && !startedInside && event.target === event.currentTarget) onClose();
      }}
      data-irt-animated=""
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={title == null ? ariaLabel : undefined}
        aria-labelledby={title != null ? titleId : ariaLabelledBy}
        aria-describedby={description != null ? descriptionId : undefined}
        tabIndex={-1}
        className={cx(styles.content, styles[`size-${size}`], showCloseButton && !hasHeader && styles.withFloatingClose, contentClassName)}
        style={width ? { width } : undefined}
      >
        {hasHeader && (
          <div className={styles.header}>
            {title != null && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {description != null && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer != null && <div className={styles.footer}>{footer}</div>}
        {showCloseButton && (
          <div className={styles.closeButton}>
            <IconButton color="var(--irt-color-text-muted)" icon="close" size={1.1} label="Close" onClick={onClose} />
          </div>
        )}
      </div>
    </div>,
    container,
  );
}
