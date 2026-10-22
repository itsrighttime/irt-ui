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
      "GFM Markdown with lazy syntax highlighting. Separate entry point — install the optional peers `react-markdown`, `remark-gfm` and `react-syntax-highlighter`.",
    imports: 'import { MarkdownRenderer } from "@itsrighttime/irt-ui/markdown";',
    controls: [{ type: "text", name: "content", default: sample }],
    render: (v) => (
      <div style={{ width: "100%" }}>
        <MarkdownRenderer content={String(v.content)} />
      </div>
    ),
    code: () => "<MarkdownRenderer content={markdown} />",
  },
];
