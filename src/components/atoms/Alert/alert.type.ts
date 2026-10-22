export type AlertType = "success" | "error" | "info" | "warning";

export interface AlertItem {
  id: string;
  message: string;
  type: AlertType;
  /** Auto-dismiss after this many ms (`0` disables). @default theme `components.alert.duration` */
  duration?: number;
}

export interface AlertProps {
  /** Text shown in the alert. */
  message: string;
  /** Visual type. */
  type: AlertType;
  /** Called after the alert has faded out (auto or manual). */
  onDismiss: () => void;
  /** Auto-dismiss after this many ms (`0` disables). @default theme `components.alert.duration` (10 000) */
  duration?: number;
}

export interface AlertContainerProps {
  /** Alerts to display (newest last). */
  alertContainer: AlertItem[];
  /** Called with the alert `id` when it is dismissed. */
  removeAlert: (id: string) => void;
}

/** @deprecated Use `(message: string, type: AlertType) => void`. Kept for compatibility. */
export type addAlertType = (message: string, type: AlertType) => void;
/** @deprecated Use `(id: string) => void`. */
export type removeAlertType = (id: string) => void;
