import type { CSSProperties } from "react";
import { renderIcon, type IconLike } from "../../../icons/renderIcon";
import { cssVars } from "../../../utils/cssVars";
import styles from "./IconError.module.css";

export interface IconErrorProps {
  /** Icon: registry name or node. */
  icon: IconLike;
  message: string;
  /** @default "100%" */
  height?: string;
  /** @default "100%" */
  width?: string;
  /** Icon size in rem. @default 2 */
  size?: number;
  style?: CSSProperties;
}

/** Icon + message placeholder for empty or failed media. */
export function IconError({ icon, message, height = "100%", width = "100%", size = 2, style }: IconErrorProps) {
  return (
    <div
      className={styles.container}
      role="img"
      aria-label={message}
      style={cssVars({ "--irt-c-icon-size": `${size}rem`, "--irt-c-height": height, "--irt-c-width": width }, style)}
    >
      <div className={styles.icon} aria-hidden="true">
        {renderIcon(icon, { size: "1em" })}
      </div>
      <p>{message}</p>
    </div>
  );
}
