import type { ReactNode } from "react";

/** Renders `code` spans inside a plain sentence. */
export function Inline({ text }: { text: string }): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : <span key={i}>{part}</span>,
  );
}
