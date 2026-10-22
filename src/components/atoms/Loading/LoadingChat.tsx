"use client";

import { useId } from "react";
import { cssVars } from "../../../utils/cssVars";
import styles from "./LoadingChat.module.css";

export interface LoadingChatProps {
  color?: string;
  height?: string;
  width?: string;
}

/** "Gooey" blob loader. Each instance uses a unique SVG filter id. */
export function LoadingChat({ color, height = "100%", width = "100%" }: LoadingChatProps) {
  const filterId = `irt-goo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <div
      className={styles.blobs}
      aria-hidden="true"
      style={cssVars(
        { "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-height": height, "--irt-c-width": width },
        { filter: `url(#${filterId})` },
      )}
    >
      <div className={styles.blobCenter} />
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <div key={n} className={styles.blob} />
      ))}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
