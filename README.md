# @itsrighttime/irt-ui

Theme-configurable, fully typed React UI library — the `atoms` and the
`Workspace` layout extracted from the irt app — for **React** and
**Next.js (App Router)** applications, distributed through **GitHub Packages**.

- Strict TypeScript, `.d.ts` for every module, ESM, tree-shakeable
- One theme definition → every component (CSS custom properties, light/dark/system)
- Centralised, replaceable icons (lucide-react by default)
- SSR-safe, correct `"use client"` boundaries, no hydration mismatches
- No router / auth / API dependencies

**Playground & docs:** https://itsrighttime.github.io/irt-ui/ — live theme builder, every component with
interactive controls and copy-ready code, icon catalogue.

## Install

The package is published to GitHub Packages. In the consuming app add an
`.npmrc` (see [`.npmrc.example`](.npmrc.example)):

```ini
@itsrighttime:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

`GITHUB_TOKEN` must be a token with `read:packages` (a classic PAT locally, or
`secrets.GITHUB_TOKEN` in Actions with `packages: read`). Never commit the token.

```bash
npm install @itsrighttime/irt-ui
```

Peer dependencies: `react` and `react-dom` ≥ 18.2. For `@itsrighttime/irt-ui/markdown`
also install `react-markdown`, `remark-gfm` and `react-syntax-highlighter`.

## Quick start

```tsx
// app entry (React) or app/layout.tsx (Next.js)
import "@itsrighttime/irt-ui/styles.css";
import { ThemeProvider } from "@itsrighttime/irt-ui/theme";
import { theme } from "./theme";

export default function App({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
```

```ts
// theme.ts
import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";

export const theme = {
  colors: { primary: "#7c3aed", secondary: "#475569" },
  typography: { fontFamily: { base: "Poppins, sans-serif" } },
  dark: { colors: { primary: "#a78bfa" } },
} satisfies ThemeConfig;
```

```tsx
import { Button, TextInput, Icon } from "@itsrighttime/irt-ui";

<Button iconLeft="plus" onClick={save}>Save</Button>
<TextInput label="Email" textType="email" setResult={setEmail} />
<Icon name="search" size={20} />
```

## Entry points

| Import | Contents |
|---|---|
| `@itsrighttime/irt-ui` | everything below except markdown |
| `@itsrighttime/irt-ui/atoms` | all atoms (Button, TextInput, Dropdown, Calendar, Table, Modal, …) |
| `@itsrighttime/irt-ui/layout` | `Workspace`, `TabBar`, `Sidebar`, workspace types/helpers |
| `@itsrighttime/irt-ui/theme` | `ThemeProvider`, `useTheme`, tokens, `ThemeConfig`, `Theme` |
| `@itsrighttime/irt-ui/icons` | `Icon`, `IconProvider`, `iconRegistry`, `IconName` |
| `@itsrighttime/irt-ui/markdown` | `MarkdownRenderer` (optional peers) |
| `@itsrighttime/irt-ui/styles.css` | component styles + default tokens (import once) |

## Next.js

- Import `styles.css` in `app/layout.tsx`; `ThemeProvider` can be rendered
  directly in the (server) root layout — its variables are in the server HTML.
- Interactive components are client components (`"use client"` is preserved in
  the build). Server components may render them, but event handlers must be
  passed from your own client components (standard RSC rules).
- Server-safe components (no client JS): `ErrorMsg`, `ErrorPage` with a URL,
  `IconError`, `LoadingBorder`, `CubesLoader` & co, `SecondaryLoading`, `PlainButton`, `TabText`.
- Give `<body>` the theme background: `body { margin: 0; background: var(--irt-color-background); }`.

## Workspace with a router

```tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { Workspace } from "@itsrighttime/irt-ui/layout";

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Workspace config={config} currentPath={usePathname()} onNavigate={(route) => router.push(route)}>
      {children}
    </Workspace>
  );
}
```

With react-router use `useLocation().pathname`, `useNavigate()` and pass `<Outlet />` as children.

## For AI coding agents

[`docs/AI_USAGE_GUIDE.md`](docs/AI_USAGE_GUIDE.md) is a complete, agent-oriented reference (rules,
every component's props and variations, theme tokens, icons, Next.js rules, recipes, do/don't).
It ships inside the package and on the docs site, so a consuming project only needs a pointer:

```md
<!-- CLAUDE.md -->
Use @itsrighttime/irt-ui for all UI. Follow @node_modules/@itsrighttime/irt-ui/docs/AI_USAGE_GUIDE.md
```

Its code snippets are type-checked against the packed package in CI (`examples/react/src/agentGuide.check.tsx`).
When you change a public API, update the guide and that file together.

## Documentation

- [Theme guide](docs/THEME_GUIDE.md) — tokens, overrides, dark mode, CSS variables, precedence
- [Architecture](docs/ARCHITECTURE.md) — structure, build, client boundaries, icons
- [Migration guide](docs/MIGRATION_GUIDE.md) — upgrading apps that used the old `atoms`/`layouts` folders
- [Component audit](docs/COMPONENT_AUDIT.md) · [Migration progress](docs/MIGRATION_PROGRESS.md)
- [Examples](examples/README.md) — React (Vite, React 18) and Next.js (App Router, React 19)

## Development

```bash
npm install
npm run typecheck   # strict tsc
npm run lint        # eslint (typescript-eslint strict + react-hooks)
npm test            # vitest + Testing Library
npm run build       # vite library build + .d.ts → dist/
npm run check:exports  # publint + are-the-types-wrong
npm run pack:local  # tarball for examples/ integration tests
npm run tokens      # regenerate src/styles/tokens.css after changing default tokens
npm run validate    # all of the above (also runs before publish)
```

## Playground

`playground/` is a Vite + React app (built with the library itself) that documents every component,
lets you tweak props with live controls, and includes a theme builder that exports `theme.ts` /
`theme.json`. It imports the library **source** through the public package paths, so it always
documents the current commit.

```bash
npm run playground:dev        # http://localhost:5173/irt-ui/
npm run playground:build      # → site-dist/ (PLAYGROUND_BASE overrides the /irt-ui/ base path)
npm run typecheck:playground
```

Add a component page by appending a `DocEntry` to `playground/src/docs/entries/*.tsx`.

## Deployment (`deploy` branch)

Everything is published from GitHub Actions — nothing from local machines.

| Branch | Workflow | What happens |
|---|---|---|
| `main`, PRs | `ci.yml` | typecheck (library + playground), lint, tests, build, export checks, playground build, React + Next.js integration from the packed tarball |
| `deploy` | `deploy.yml` | validate → **publish** `@itsrighttime/irt-ui` to GitHub Packages (skipped if that version already exists) and tag `vX.Y.Z` → **build & deploy the playground** to GitHub Pages |

Release a new version:

```bash
# on main: bump the version (semver) and commit
npm version minor --no-git-tag-version
git commit -am "release: v$(node -p "require('./package.json').version")"
git push origin main

# trigger deployment
git push origin main:deploy
```

Pushing to `deploy` without a version bump redeploys the playground only.

One-time repository setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. The workflow requests `packages: write` / `contents: write` itself; only if your organisation restricts `GITHUB_TOKEN` permissions do you need to allow them under **Settings → Actions → General**.
3. After the first publish, check the package visibility under the repo's **Packages** (public repos publish public packages).
4. Optional: protect the `deploy` branch so only maintainers can push.

Installing from GitHub Packages always needs a token with `read:packages`, even for public packages.
