import { cx } from "../../../../utils/cx";
import styles from "./TabText.module.css";

export interface TabTextProps {
  text: string;
  onClick?: () => void;
  /** Text colour override. By default inactive tabs are muted and the active tab uses the primary colour. */
  color?: string;
  isActive?: boolean;
  disabled?: boolean;
}

/** Text tab. Long labels are truncated with an ellipsis; the full text is in `title`. */
export function TabText({ text, onClick, color, isActive = false, disabled = false }: TabTextProps) {
  return (
    <button
      type="button"
      style={color ? { color } : undefined}
      title={text}
      className={cx(styles.tabText, isActive && styles.active)}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={styles.label}>{text}</span>
    </button>
  );
}
