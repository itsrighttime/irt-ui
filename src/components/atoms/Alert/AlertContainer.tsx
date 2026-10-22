"use client";

import { Alert } from "./Alert";
import styles from "./Alert.module.css";
import type { AlertContainerProps } from "./alert.type";

export type { AlertContainerProps, AlertItem } from "./alert.type";

/** Fixed top-right stack of `Alert`s. */
export function AlertContainer({ alertContainer, removeAlert }: AlertContainerProps) {
  return (
    <div className={styles.alertContainer}>
      {alertContainer.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onDismiss={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}
