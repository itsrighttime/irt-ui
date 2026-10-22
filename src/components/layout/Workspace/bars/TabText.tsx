import { cx } from "../../../../utils/cx";
import styles from "./TabText.module.css";

export interface TabTextProps {
  text: string;
  onClick?: () => void;
  /** @default var(--irt-color-primary) */
  color?: string;
  isActive?: boolean;
}

/** Text tab. Long labels are truncated with an ellipsis; the full text is in `title`. */
export function TabText({ text, onClick, color = "var(--irt-color-primary)", isActive = false }: TabTextProps) {
  return (
    <button
      type="button"
      style={{ color }}
      title={text}
      className={cx(styles.tabText, isActive && styles.active)}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className={styles.label}>{text}</span>
    </button>
  );
}
