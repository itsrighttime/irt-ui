"use client";

import { cx } from "../../../utils/cx";
import { Alert } from "./Alert";
import styles from "./Alert.module.css";
import type { AlertContainerProps } from "./alert.type";

export type { AlertContainerProps, AlertItem } from "./alert.type";

/** Fixed stack of `Alert`s (top-right by default). */
export function AlertContainer({ alertContainer, removeAlert, position = "top-right", className }: AlertContainerProps) {
  return (
    <div className={cx(styles.alertContainer, styles[position], className)} aria-label="Notifications" role="region">
      {alertContainer.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          title={alert.title}
          type={alert.type}
          duration={alert.duration}
          onDismiss={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}
