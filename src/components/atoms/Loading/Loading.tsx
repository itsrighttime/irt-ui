"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import { LoadingChat } from "./LoadingChat";
import { BounceLoader, CubesLoader, FoldingLoader, PulseLoader } from "./LoadingStyle";
import styles from "./Loading.module.css";

export type LoaderType = "CubesLoader" | "FoldingLoader" | "BounceLoader" | "PulseLoader" | "LoadingChat";

export interface LoadingProps {
  /** @default "CubesLoader" */
  type?: LoaderType;
  /** `"top"` overlays from the top-left of the positioned parent. @default "top" */
  display?: "top" | "center";
  /** @default "relative" */
  position?: "relative" | "absolute";
  /** @default "100%" */
  windowHeight?: string;
  /** @default "100%" */
  windowWidth?: string;
  color?: string;
  /** Show `text` with animated dots. @default false */
  showText?: boolean;
  /** @default "Loading" */
  text?: string;
}

const DOTS = ["", ".", "..", "..."] as const;

function renderLoader(type: LoaderType, color?: string): ReactNode {
  switch (type) {
    case "FoldingLoader":
      return <FoldingLoader color={color} />;
    case "BounceLoader":
      return <BounceLoader color={color} />;
    case "PulseLoader":
      return <PulseLoader color={color} />;
    case "LoadingChat":
      return <LoadingChat color={color} />;
    case "CubesLoader":
    default:
      return <CubesLoader color={color} />;
  }
}

/** Loading indicator with five styles and optional animated text. */
export function Loading({
  type = "CubesLoader",
  display = "top",
  position = "relative",
  windowHeight = "100%",
  windowWidth = "100%",
  color,
  showText = false,
  text = "Loading",
}: LoadingProps) {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    if (!showText) return;
    const id = setInterval(() => setDotIndex((i) => (i + 1) % DOTS.length), 500);
    return () => clearInterval(id);
  }, [showText]);

  const positionStyle: CSSProperties =
    display === "top" && position === "relative" ? { position: "relative" } : { position: "absolute" };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={text}
      className={cx(styles.loading, display === "top" && styles.top)}
      style={cssVars(
        { "--irt-c-color": color ?? "var(--irt-color-primary)" },
        { height: windowHeight, width: windowWidth, ...positionStyle },
      )}
    >
      {renderLoader(type, color)}
      {showText && (
        <div className={styles.loadingTextWrapper} aria-hidden="true">
          <p className={styles.text}>{text}</p>
          <p className={styles.loadingText}>{DOTS[dotIndex]}</p>
        </div>
      )}
    </div>
  );
}
