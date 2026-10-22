"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cx } from "../utils/cx";
import { markdownComponents } from "./MarkdownComponents";
import styles from "./Markdown.module.css";

export interface MarkdownRendererProps {
  /** Markdown source (GitHub-flavoured). Raw HTML is not rendered. */
  content: string;
  /** Override or add element renderers. */
  components?: Components;
  className?: string;
}

/**
 * Renders Markdown with GFM (tables, task lists, strikethrough) and lazy
 * syntax highlighting. Import from `@itsrighttime/irt-ui/markdown`; requires the
 * optional peers `react-markdown`, `remark-gfm` and `react-syntax-highlighter`.
 */
export function MarkdownRenderer({ content, components, className }: MarkdownRendererProps) {
  return (
    <article className={cx(styles.markdown, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ ...markdownComponents, ...components }}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
