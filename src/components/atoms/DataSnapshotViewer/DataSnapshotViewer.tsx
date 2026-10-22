"use client";

import { useId, useMemo, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useIsMounted } from "../../../hooks/useIsMounted";
import { usePortalContainer } from "../../../theme/useTheme";
import { IconButton } from "../Button/IconButton";
import styles from "./DataSnapshotViewer.module.css";

export interface DataSnapshotViewerProps<T extends object> {
  /** Record to show; nothing renders when `null`. */
  data: T | null;
  /** @default "Record Details" */
  title?: string;
  onClose: () => void;
  /** Locale for date values. @default "en-IN" */
  locale?: string;
}

type Primitive = string | number | boolean | bigint | null | undefined;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date);

/** Flattens nested objects/arrays into `{ "a.b": 1, "list[0].x": 2 }`. */
export function flattenObject(input: unknown, prefix = ""): Record<string, Primitive | Date | Primitive[]> {
  const out: Record<string, Primitive | Date | Primitive[]> = {};
  const walk = (value: unknown, path: string) => {
    if (Array.isArray(value)) {
      if (value.every((item) => !isPlainObject(item) && !Array.isArray(item))) {
        out[path] = value as Primitive[];
      } else {
        value.forEach((item, i) => walk(item, `${path}[${i}]`));
      }
      return;
    }
    if (isPlainObject(value)) {
      const entries = Object.entries(value);
      if (entries.length === 0 && path) out[path] = undefined;
      for (const [key, child] of entries) walk(child, path ? `${path}.${key}` : key);
      return;
    }
    out[path] = value as Primitive | Date;
  };
  walk(input, prefix);
  return out;
}

const formatKey = (key: string): string =>
  key
    .split(".")
    .join(" > ")
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Only ISO-like date strings are treated as dates (not "5" or "1.2").
const ISO_DATE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function renderValue(value: Primitive | Date | Primitive[], locale: string): ReactNode {
  if (value === null || value === undefined) return "—";
  if (value instanceof Date) return value.toLocaleString(locale);
  if (typeof value === "string" && ISO_DATE.test(value) && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toLocaleString(locale);
  }
  if (Array.isArray(value)) return value.length ? value.map((v) => String(v ?? "—")).join(", ") : "[]";
  return String(value);
}

/** Side drawer that shows every (flattened) field of a record. */
export function DataSnapshotViewer<T extends object>({
  data,
  title = "Record Details",
  onClose,
  locale = "en-IN",
}: DataSnapshotViewerProps<T>) {
  const titleId = useId();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const container = usePortalContainer();
  const mounted = useIsMounted();
  const isOpen = data !== null;
  const flat = useMemo(() => (data ? flattenObject(data) : {}), [data]);

  useEscapeKey(onClose, isOpen);
  useFocusTrap(drawerRef, isOpen && mounted);

  if (!isOpen || !mounted || !container) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.drawer}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
          <IconButton onClick={onClose} size={1.2} color="var(--irt-color-danger)" icon="close" label="Close" />
        </div>
        <hr className={styles.separator} />
        <dl className={styles.list}>
          {Object.entries(flat).map(([key, value]) => (
            <div key={key} className={styles.row}>
              <dt className={styles.key}>{formatKey(key)}</dt>
              <dd className={styles.value}>{renderValue(value, locale)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    container,
  );
}
