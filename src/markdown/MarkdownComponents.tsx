"use client";

import { lazy, Suspense, type ComponentType, type CSSProperties } from "react";
import type { Components } from "react-markdown";
import styles from "./Markdown.module.css";
import tableStyles from "./MarkdownTable.module.css";

interface HighlighterProps {
  language: string;
  style: Record<string, CSSProperties>;
  children: string;
}

// Loaded on demand: the highlighter is large and only needed for fenced code.
const SyntaxHighlighter = lazy(async () => {
  const [{ Prism }, { default: style }] = await Promise.all([
    import("react-syntax-highlighter"),
    import("react-syntax-highlighter/dist/esm/styles/prism/material-light"),
  ]);
  const Highlighter = Prism as unknown as ComponentType<HighlighterProps>;
  function Highlighted(props: Omit<HighlighterProps, "style">) {
    return <Highlighter {...props} style={style as Record<string, CSSProperties>} />;
  }
  return { default: Highlighted };
});

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
    if (match?.[1]) {
      return (
        <Suspense
          fallback={
            <pre className={styles.codeBlock}>
              <code>{text}</code>
            </pre>
          }
        >
          <SyntaxHighlighter language={match[1]}>{text.replace(/\n$/, "")}</SyntaxHighlighter>
        </Suspense>
      );
    }
    if (text.includes("\n")) {
      return (
        <pre className={styles.codeBlock}>
          <code className={className}>{children}</code>
        </pre>
      );
    }
    return <code className={styles.inlineCode}>{children}</code>;
  },

  table: ({ children }) => (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>{children}</table>
    </div>
  ),
};
