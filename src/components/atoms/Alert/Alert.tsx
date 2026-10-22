"use client";

import { useEffect, useRef, useState } from "react";
import { renderIcon } from "../../../icons/renderIcon";
import type { IconName } from "../../../icons/registry";
import { useTheme } from "../../../theme/useTheme";
import { cx } from "../../../utils/cx";
import { IconButton } from "../Button/IconButton";
import styles from "./Alert.module.css";
import type { AlertProps, AlertType } from "./alert.type";

export type { AlertProps, AlertType, AlertPosition } from "./alert.type";

const FADE_MS = 400;

const TYPE_ICON: Record<AlertType, IconName> = {
  success: "checkCircle",
  error: "alertCircle",
  info: "info",
  warning: "alertTriangle",
};

const TYPE_COLOR: Record<AlertType, string> = {
  success: "var(--irt-color-success)",
  error: "var(--irt-color-danger)",
  info: "var(--irt-color-info)",
  warning: "var(--irt-color-warning)",
};

/**
 * Dismissible notification with a type icon and an auto-dismiss progress bar.
 * The countdown pauses while the pointer is over the alert or it has focus.
 */
export function Alert({ message, type, onDismiss, duration, title, icon = true, dismissible = true, action, className }: AlertProps) {
  const { theme } = useTheme();
  const total = duration ?? theme.components.alert.duration;
  const seconds = Math.max(0, Math.round(total / 1000));

  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isVisible, setIsVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (seconds === 0 || !isVisible || paused) return;
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- countdown reached zero
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, seconds, isVisible, paused]);

  useEffect(() => {
    if (isVisible) return;
    const timer = setTimeout(() => onDismissRef.current(), FADE_MS);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const width = seconds === 0 ? 0 : (timeLeft / seconds) * 100;
  const urgent = type === "error" || type === "warning";
  const leadingIcon = icon === false ? null : icon === true ? TYPE_ICON[type] : icon;

  return (
    <div
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
      className={cx(styles.alert, styles[type], !isVisible && styles.fadeOut, className)}
      style={{ ["--irt-c-alert-color" as string]: TYPE_COLOR[type] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {leadingIcon != null && (
        <span className={styles.icon} aria-hidden="true">
          {renderIcon(leadingIcon, { size: "1.25em" })}
        </span>
      )}
      <div className={styles.body}>
        {title != null && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{message}</div>
        {action != null && <div className={styles.action}>{action}</div>}
      </div>
      {dismissible && (
        <IconButton
          icon="close"
          label="Dismiss"
          onClick={() => setIsVisible(false)}
          size={0.9}
          color="var(--irt-color-text-muted)"
          className={styles.closeButton}
        />
      )}
      {seconds > 0 && <div className={styles.statusBar} style={{ width: `${width}%` }} aria-hidden="true" />}
    </div>
  );
}
