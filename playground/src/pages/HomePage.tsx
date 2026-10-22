import { Button } from "@itsrighttime/irt-ui";
import { Icon } from "@itsrighttime/irt-ui/icons";
import { navigate } from "../router";
import { CodeBlock } from "../ui/CodeBlock";
import { entries } from "../docs/registry";

const REPO = "https://github.com/itsrighttime/irt-ui";

export function HomePage() {
  return (
    <article className="pg-page">
      <header className="pg-hero">
        <span className="pg-eyebrow">
          {__LIB_NAME__} · v{__LIB_VERSION__}
        </span>
        <h1>irt-ui</h1>
        <p className="pg-lead">
          A theme-configurable, fully typed React component library for React and Next.js apps. Define your theme once — every component
          follows it. {entries.length} documented components, a live theme builder and an icon catalogue.
        </p>
        <div className="pg-row">
          <Button iconLeft="settings" onClick={() => navigate("/theme")}>
            Open the theme builder
          </Button>
          <Button variant="secondary" iconRight="chevronRight" onClick={() => navigate("/components/button")}>
            Browse components
          </Button>
          <Button variant="ghost" as="a" href={REPO} target="_blank" rel="noreferrer" iconRight="externalLink">
            GitHub
          </Button>
        </div>
      </header>

      <section className="pg-features">
        {[
          ["settings", "One theme, everywhere", "Typed tokens become --irt-* CSS variables. Light, dark and system modes, nested scopes, SSR-safe."],
          ["check", "Strict TypeScript", "Every prop typed, icon names checked, theme config validated. Declarations for every module."],
          ["home", "React & Next.js", "Correct \"use client\" boundaries, no browser globals during render, no hydration mismatches."],
          ["refresh", "Replaceable icons", "A central registry (lucide by default). Swap any icon app-wide with IconProvider."],
        ].map(([icon, title, text]) => (
          <div key={title} className="pg-feature">
            <Icon name={icon as "check"} size={22} />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>1. Install from GitHub Packages</h2>
        <p>
          Add an <code>.npmrc</code> next to your app's <code>package.json</code>. GitHub Packages needs a token with{" "}
          <code>read:packages</code> even for public packages — keep it in an environment variable, never in the file.
        </p>
        <CodeBlock title=".npmrc" language="ini" code={"@itsrighttime:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}"} />
        <CodeBlock title="terminal" language="bash" code={`npm install ${__LIB_NAME__}`} />
      </section>

      <section>
        <h2>2. Add the stylesheet and a ThemeProvider</h2>
        <CodeBlock
          title="theme.ts"
          code={[
            'import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";',
            "",
            "export const theme = {",
            '  colors: { primary: "#7c3aed" },',
            '  typography: { fontFamily: { base: "Poppins, sans-serif" } },',
            '  dark: { colors: { primary: "#a78bfa" } },',
            "} satisfies ThemeConfig;",
          ].join("\n")}
        />
        <CodeBlock
          title="React: main.tsx  ·  Next.js: app/layout.tsx"
          code={[
            'import "@itsrighttime/irt-ui/styles.css";',
            'import { ThemeProvider } from "@itsrighttime/irt-ui/theme";',
            'import { theme } from "./theme";',
            "",
            '<ThemeProvider theme={theme} defaultMode="system">',
            "  {children}",
            "</ThemeProvider>",
          ].join("\n")}
        />
        <p>
          Design your theme visually in the <a href="#/theme">theme builder</a> and copy the generated file.
        </p>
      </section>

      <section>
        <h2>3. Use components</h2>
        <CodeBlock
          code={[
            'import { Button, TextInput, Dropdown } from "@itsrighttime/irt-ui";',
            "",
            '<TextInput label="Email" textType="email" value={email} setResult={setEmail} />',
            '<Dropdown options={["Admin", "Editor"]} placeholder="Role" value={roles} setResult={setRoles} />',
            '<Button iconLeft="check" onClick={save}>Save</Button>',
          ].join("\n")}
        />
        <p>Entry points:</p>
        <ul className="pg-list">
          <li>
            <code>@itsrighttime/irt-ui</code> — everything except markdown
          </li>
          <li>
            <code>@itsrighttime/irt-ui/atoms</code>, <code>/layout</code>, <code>/theme</code>, <code>/icons</code>
          </li>
          <li>
            <code>@itsrighttime/irt-ui/markdown</code> — needs <code>react-markdown</code>, <code>remark-gfm</code>,{" "}
            <code>react-syntax-highlighter</code>
          </li>
        </ul>
      </section>

      <section>
        <h2>Next.js notes</h2>
        <ul className="pg-list">
          <li>Import the stylesheet and render ThemeProvider in the root layout (a server component is fine).</li>
          <li>Interactive components are client components; pass event handlers from your own client components.</li>
          <li>
            Give the page the theme background: <code>{"body { margin: 0; background: var(--irt-color-background); }"}</code>
          </li>
        </ul>
      </section>
    </article>
  );
}
