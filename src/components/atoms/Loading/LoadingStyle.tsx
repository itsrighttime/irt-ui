import { cssVars } from "../../../utils/cssVars";
import styles from "./LoadingStyle.module.css";

export interface LoaderProps {
  /** Loader colour. @default var(--irt-color-primary) */
  color?: string;
}

const vars = (color?: string) => cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)" });

/** 3×3 pulsing cube grid. */
export function CubesLoader({ color }: LoaderProps) {
  return (
    <div className={styles.cubes} style={vars(color)} aria-hidden="true">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <div key={n} className={`${styles.skCube} ${styles[`skCube${n}`]}`} />
      ))}
    </div>
  );
}

/** Folding cube. */
export function FoldingLoader({ color }: LoaderProps) {
  return (
    <div className={styles.folding} style={vars(color)} aria-hidden="true">
      <div className={`${styles.skCube} ${styles.skCube1}`} />
      <div className={`${styles.skCube} ${styles.skCube2}`} />
      <div className={`${styles.skCube} ${styles.skCube4}`} />
      <div className={`${styles.skCube} ${styles.skCube3}`} />
    </div>
  );
}

/** Three bouncing dots. */
export function BounceLoader({ color }: LoaderProps) {
  return (
    <div className={styles.bounce} style={vars(color)} aria-hidden="true">
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div className={styles.bounce3} />
    </div>
  );
}

/** Heartbeat line. */
export function PulseLoader({ color }: LoaderProps) {
  return (
    <div className={styles.pulse} style={vars(color)} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" className={styles.svg}>
        <polyline
          fill="none"
          strokeWidth="3"
          className={styles.polyline}
          points="2.4,58.7 70.8,58.7 76.1,46.2 81.1,58.7 89.9,58.7 93.8,66.5 102.8,22.7 110.6,78.7 115.3,58.7 126.4,58.7 134.4,54.7 142.4,58.7 197.8,58.7"
        />
      </svg>
    </div>
  );
}
