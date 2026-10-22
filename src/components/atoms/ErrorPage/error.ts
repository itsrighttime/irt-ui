import type { IconName } from "../../../icons/registry";

const ICONS: Record<number, IconName> = {
  400: "search",
  401: "key",
  403: "lock",
  404: "search",
  500: "alertTriangle",
  502: "clockAlert",
  503: "clockAlert",
  504: "wifiOff",
};

const TITLES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Access Denied",
  404: "Page Not Found",
  500: "Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

/** Icon name for an HTTP status code. */
export const getErrorIcon = (statusCode: number): IconName => ICONS[statusCode] ?? "alertTriangle";

/** Human-readable title for an HTTP status code. */
export const getErrorTitle = (statusCode: number): string => TITLES[statusCode] ?? "Something went wrong";
