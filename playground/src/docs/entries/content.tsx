import { MarkdownRenderer } from "@itsrighttime/irt-ui/markdown";
import type { DocEntry } from "../types";

const sample = `## Release notes

The **irt-ui** markdown renderer supports *GitHub-flavoured* Markdown:

- [x] tables, task lists and ~~strikethrough~~
- [ ] raw HTML is **not** rendered (safe by default)

| Component | Status |
|---|---|
| Button | **stable** |
| Workspace | beta |

\`\`\`ts
import { Button } from "@itsrighttime/irt-ui";
\`\`\`

> Links open in a new tab: [repository](https://github.com/itsrighttime/irt-ui)
`;

export const contentEntries: DocEntry[] = [
  {
    id: "markdown",
    title: "MarkdownRenderer",
    group: "Content",
    description:
      "GFM Markdown (tables, task lists, strikethrough) with lazy, theme-aware syntax highlighting and copyable code blocks. Raw HTML is never rendered. Separate entry point — install the optional peers `react-markdown`, `remark-gfm` and `react-syntax-highlighter`.",
    imports: 'import { MarkdownRenderer } from "@itsrighttime/irt-ui/markdown";',
    controls: [{ type: "text", name: "content", default: sample, group: "Content", hint: "Edit the Markdown source", multiline: true }],
    align: "stretch",
    render: (v) => (
      <div className="pg-markdown-frame">
        <MarkdownRenderer content={String(v.content)} />
      </div>
    ),
    code: () =>
      [
        'import { MarkdownRenderer } from "@itsrighttime/irt-ui/markdown";',
        "",
        "<MarkdownRenderer content={markdown} />",
        "// Override renderers:",
        '<MarkdownRenderer content={markdown} components={{ a: ({ href, children }) => <Link href={href ?? "#"}>{children}</Link> }} />',
      ].join("\n"),
  },
];
