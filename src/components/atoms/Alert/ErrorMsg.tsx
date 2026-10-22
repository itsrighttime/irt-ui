import type { CSSProperties } from "react";

export interface ErrorMsgProps {
  /** Error text. */
  message: string;
  /** Semi-bold text. @default true */
  bold?: boolean;
  /** Font size as a multiple of the base font size. @default 0.8 */
  fontSize?: number;
  /** @default "left" */
  textAlign?: "left" | "center" | "right" | "justify";
  /** @default "10px" */
  padding?: string;
  className?: string;
  id?: string;
}

/** Inline error message (server-component safe). */
export function ErrorMsg({
  message,
  bold = true,
  fontSize = 0.8,
  textAlign = "left",
  padding = "10px",
  className,
  id,
}: ErrorMsgProps) {
  const style: CSSProperties = {
    fontWeight: bold ? "var(--irt-font-weight-semibold)" : "var(--irt-font-weight-regular)",
    fontSize: `calc(var(--irt-font-size-base) * ${fontSize})`,
    color: "var(--irt-color-danger)",
    textAlign,
    padding,
    textWrap: "wrap",
    margin: 0,
  };
  return (
    <p id={id} role="alert" className={className} style={style}>
      {message}
    </p>
  );
}
