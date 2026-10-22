import { useState } from "react";
import { Button } from "@itsrighttime/irt-ui";

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

/** Code sample with a copy button. */
export function CodeBlock({ code, language = "tsx", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <figure className="pg-code">
      <figcaption>
        <span>{title ?? language}</span>
        <Button size="small" variant="ghost" iconLeft={copied ? "check" : "copy"} onClick={() => void copy()}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
