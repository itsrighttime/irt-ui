"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../theme/useTheme";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import styles from "./Alert.module.css";
import type { AlertProps } from "./alert.type";

export type { AlertProps, AlertType } from "./alert.type";

const FADE_MS = 400;

/** Dismissible notification with an auto-dismiss progress bar. */
export function Alert({ message, type, onDismiss, duration }: AlertProps) {
  const { theme } = useTheme();
  const total = duration ?? theme.components.alert.duration;
  const seconds = Math.max(0, Math.round(total / 1000));

  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isVisible, setIsVisible] = useState(true);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (seconds === 0 || !isVisible) return;
    if (timeLeft <= 0) {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, seconds, isVisible]);

  useEffect(() => {
    if (isVisible) return;
    const timer = setTimeout(() => onDismissRef.current(), FADE_MS);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const width = seconds === 0 ? 0 : (timeLeft / seconds) * 100;

  return (
    <div
      role={type === "error" || type === "warning" ? "alert" : "status"}
      aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
      className={cx(styles.alert, styles[type], !isVisible && styles.fadeOut)}
    >
      {message}
      {seconds > 0 && <div className={styles.statusBar} style={{ width: `${width}%` }} />}
      <div className={styles.crossIcon}>
        <IconButton
          icon="close"
          label="Dismiss"
          onClick={() => setIsVisible(false)}
          size={1}
          color="var(--irt-color-on-danger)"
          className={styles.closeButton}
        />
      </div>
    </div>
  );
}
