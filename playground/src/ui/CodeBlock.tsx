import { useState } from "react";
import PrismLight from "react-syntax-highlighter/dist/esm/prism-light";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { Button } from "@itsrighttime/irt-ui";
import { useTheme } from "@itsrighttime/irt-ui/theme";

PrismLight.registerLanguage("tsx", tsx);
PrismLight.registerLanguage("bash", bash);
PrismLight.registerLanguage("json", json);
PrismLight.registerLanguage("css", css);
PrismLight.registerLanguage("markdown", markdown);

const ALIASES: Record<string, string> = { ts: "tsx", typescript: "tsx", jsx: "tsx", js: "tsx", sh: "bash", ini: "bash", md: "markdown" };

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  /** Hide the header bar (title + copy). */
  bare?: boolean;
}

/** Syntax-highlighted code sample with a copy button. */
export function CodeBlock({ code, language = "tsx", title, bare = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedMode } = useTheme();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  const lang = ALIASES[language] ?? language;
  return (
    <figure className="pg-code">
      {!bare && (
        <figcaption>
          <span>{title ?? language}</span>
          <Button size="small" variant="ghost" iconLeft={copied ? "check" : "copy"} onClick={() => void copy()}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </figcaption>
      )}
      <PrismLight
        language={lang}
        style={resolvedMode === "dark" ? oneDark : oneLight}
        customStyle={{ margin: 0, padding: "14px 16px", background: "transparent", fontSize: "0.8125rem", lineHeight: 1.65 }}
        codeTagProps={{ style: { fontFamily: "var(--irt-font-family-mono)", background: "transparent" } }}
      >
        {code}
      </PrismLight>
      {bare && (
        <span className="pg-code-copy">
          <Button size="small" variant="ghost" iconOnly iconLeft={copied ? "check" : "copy"} ariaLabel="Copy code" tooltip="Copy" onClick={() => void copy()} />
        </span>
      )}
    </figure>
  );
}
