"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { usePortalContainer } from "../../../theme/useTheme";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import styles from "./Modal.module.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible name of the dialog. */
  ariaLabel?: string;
  /** id of an element inside `children` that labels the dialog. */
  ariaLabelledBy?: string;
  /** @default true */
  closeOnOverlayClick?: boolean;
  /** @default true */
  closeOnEscape?: boolean;
  /** Show the floating close button. @default true */
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
}

/** Centered modal dialog rendered in a portal with focus trap and Escape handling. */
export function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
  ariaLabelledBy,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  contentClassName,
  style,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const container = usePortalContainer();
  const mounted = useIsMounted();

  useEscapeKey(onClose, isOpen && closeOnEscape);
  useFocusTrap(contentRef, isOpen && mounted);

  if (!isOpen || !mounted || !container) return null;

  return createPortal(
    <div
      className={cx(styles.overlay, className)}
      style={style}
      onClick={closeOnOverlayClick ? onClose : undefined}
      data-irt-animated=""
    >
      {showCloseButton && (
        <div className={styles.close} onClick={(event) => event.stopPropagation()}>
          <IconButton
            className={styles.closeButton}
            color="var(--irt-color-on-danger)"
            icon="close"
            size={1.2}
            label="Close"
            onClick={onClose}
          />
        </div>
      )}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
        className={cx(styles.content, contentClassName)}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    container,
  );
}
