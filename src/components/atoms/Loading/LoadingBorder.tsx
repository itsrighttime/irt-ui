import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./LoadingBorder.module.css";

export interface LoadingBorderProps {
  /** Animate the border. @default false */
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps content with an animated "scanning" border while `loading`.
 *
 * @example
 * <LoadingBorder loading={isLoading}><Card /></LoadingBorder>
 */
export function LoadingBorder({ loading = false, children, className }: LoadingBorderProps) {
  return (
    <div className={cx(styles.container, loading && styles.loading, className)} aria-busy={loading || undefined}>
      {children}
    </div>
  );
}

/** @deprecated Use the named export `LoadingBorder`. */
export default LoadingBorder;
