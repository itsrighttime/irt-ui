import type { ReactNode } from "react";
import type { IconLike } from "../../../icons/renderIcon";

export type AlertType = "success" | "error" | "info" | "warning";

export interface AlertItem {
  id: string;
  message: string;
  type: AlertType;
  /** Optional bold heading above the message. */
  title?: string;
  /** Auto-dismiss after this many ms (`0` disables). @default theme `components.alert.duration` */
  duration?: number;
}

export interface AlertProps {
  /** Content shown in the alert. */
  message: ReactNode;
  /** Visual type. */
  type: AlertType;
  /** Optional bold heading above the message. */
  title?: ReactNode;
  /** Leading icon. `true`/omitted → the type's default icon, `false` → none, or any registry name / node. */
  icon?: IconLike | boolean;
  /** Show the dismiss (×) button. @default true */
  dismissible?: boolean;
  /** Optional action (e.g. an "Undo" button) rendered under the message. */
  action?: ReactNode;
  className?: string;
  /** Called after the alert has faded out (auto or manual). */
  onDismiss: () => void;
  /** Auto-dismiss after this many ms (`0` disables). The timer pauses while hovered or focused. @default theme `components.alert.duration` (10 000) */
  duration?: number;
}

/** Screen corner/edge of an {@link AlertContainer}. */
export type AlertPosition = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";

export interface AlertContainerProps {
  /** Alerts to display (newest last). */
  alertContainer: AlertItem[];
  /** Called with the alert `id` when it is dismissed. */
  removeAlert: (id: string) => void;
  /** Where the stack is pinned. @default "top-right" */
  position?: AlertPosition;
  className?: string;
}

/** @deprecated Use `(message: string, type: AlertType) => void`. Kept for compatibility. */
export type addAlertType = (message: string, type: AlertType) => void;
/** @deprecated Use `(id: string) => void`. */
export type removeAlertType = (id: string) => void;
