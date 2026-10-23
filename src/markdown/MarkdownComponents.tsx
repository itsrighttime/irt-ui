"use client";

import { lazy, Suspense, useState, type ComponentType, type CSSProperties } from "react";
import type { Components } from "react-markdown";
import { Icon } from "../icons/Icon";
import { useTheme } from "../theme/useTheme";
import styles from "./Markdown.module.css";
import tableStyles from "./MarkdownTable.module.css";

interface HighlighterProps {
  language: string;
  style: Record<string, CSSProperties>;
  customStyle?: CSSProperties;
  codeTagProps?: { style?: CSSProperties };
  children: string;
}

interface HighlightedProps {
  language: string;
  dark: boolean;
  children: string;
}

const HIGHLIGHT_BOX: CSSProperties = {
  margin: 0,
  padding: "14px 16px",
  background: "transparent",
  fontSize: "0.875em",
  lineHeight: 1.6,
};

// Loaded on demand: the highlighter is large and only needed for fenced code.
const SyntaxHighlighter = lazy(async () => {
  const [{ Prism }, { default: light }, { default: dark }] = await Promise.all([
    import("react-syntax-highlighter"),
    import("react-syntax-highlighter/dist/esm/styles/prism/one-light"),
    import("react-syntax-highlighter/dist/esm/styles/prism/one-dark"),
  ]);
  const Highlighter = Prism as unknown as ComponentType<HighlighterProps>;
  function Highlighted({ language, dark: isDark, children }: HighlightedProps) {
    return (
      <Highlighter
        language={language}
        style={(isDark ? dark : light) as Record<string, CSSProperties>}
        customStyle={HIGHLIGHT_BOX}
        codeTagProps={{ style: { background: "transparent", fontFamily: "var(--irt-font-family-mono)" } }}
      >
        {children}
      </Highlighter>
    );
  }
  return { default: Highlighted };
});

/** Fenced code block: language label, copy button and lazy highlighting. */
function CodeBlock({ language, code }: { language?: string; code: string }) {
  const { resolvedMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  const plain = (
    <pre className={styles.codeBlock}>
      <code>{code}</code>
    </pre>
  );
  return (
    <div className={styles.codeFrame}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLanguage}>{language ?? "text"}</span>
        <button type="button" className={styles.copyButton} onClick={copy} aria-label={copied ? "Copied" : "Copy code"}>
          <Icon name={copied ? "check" : "copy"} size="0.95em" />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      {language ? (
        <Suspense fallback={plain}>
          <SyntaxHighlighter language={language} dark={resolvedMode === "dark"}>
            {code}
          </SyntaxHighlighter>
        </Suspense>
      ) : (
        plain
      )}
    </div>
  );
}

/** Custom renderers used by `MarkdownRenderer`. */
export const markdownComponents: Components = {
  h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
  h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,

  // Paragraphs that only wrap a code block would produce invalid <p><pre> nesting.
  p: ({ node, children }) => {
    const hasBlockCode = node?.children.some(
      (child) => child.type === "element" && (child.tagName === "pre" || child.tagName === "code"),
    );
    return hasBlockCode ? <>{children}</> : <p className={styles.p}>{children}</p>;
  },

  a: ({ href, children }) => (
    <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),

  ul: ({ children }) => <ul className={styles.ul}>{children}</ul>,
  ol: ({ children }) => <ol className={styles.ol}>{children}</ol>,
  li: ({ children }) => <li className={styles.li}>{children}</li>,
  blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,

  code: ({ className, children }) => {
    const text = String(children ?? "");
    const match = /language-(\w+)/.exec(className ?? "");
    if (match?.[1]) return <CodeBlock language={match[1]} code={text.replace(/\n$/, "")} />;
    if (text.includes("\n")) return <CodeBlock code={text.replace(/\n$/, "")} />;
    return <code className={styles.inlineCode}>{children}</code>;
  },

  hr: () => <hr className={styles.hr} />,
  img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className={styles.img} loading="lazy" />,
  h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,

  table: ({ children }) => (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>{children}</table>
    </div>
  ),
};
