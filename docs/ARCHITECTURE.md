# Architecture

## Layout

```text
src/
├── components/
│   ├── atoms/<Group>/        one folder per component family (Button, TextInput, Selection, Overlay, Table, Upload, …)
│   │   ├── X.tsx             component
│   │   ├── X.types.ts        public types (where shared)
│   │   ├── X.module.css      CSS Module (only --irt-* tokens / --irt-c-* locals)
│   │   ├── X.test.tsx        Vitest + Testing Library
│   │   └── index.ts          explicit public exports of the group
│   └── layout/Workspace/     Workspace shell, TabBar, Sidebar, consts, routing, filters
├── theme/                    tokens/, types, defaultTheme, resolveTheme, ThemeProvider, useTheme
├── icons/                    registry (only file importing lucide-react), Icon, IconProvider, legacy aliases
├── markdown/                 separate entry (optional peer deps)
├── hooks/                    useControllableState, useSyncedState, useClickOutside, useEscapeKey,
│                             useFocusTrap, useIsMounted, useSmartPosition, useIsomorphicLayoutEffect
├── utils/                    cssVars, cx, mergeRefs, fromKebabCase, canUseDOM
├── types/                    BaseProps, ComponentSize, ComponentRadius
├── styles/                   tokens.css (generated), index.css (base + a11y helpers)
└── index.ts                  root entry
examples/react, examples/nextjs   apps that install the packed tarball
playground/                       docs + theme builder (GitHub Pages), built from src/ via package-path aliases
```

Dependency direction: `components → (theme, icons, hooks, utils, types)`;
`theme`, `icons`, `hooks`, `utils` never import components. Components import
each other by relative path (no barrel self-imports), so there are no cycles.

## Build

- **Vite library mode** (Rolldown), ESM only, `preserveModules` → one output
  file per source module under `dist/` (tree-shakeable, deep imports possible).
- **`"use client"` preservation**: a small plugin re-adds the directive to every
  output chunk whose source declared it (bundlers strip module directives).
  Pure modules (types, tokens, utils, server-safe components) stay directive-free,
  so the library is not client-only as a whole.
- **CSS**: CSS Modules with stable, prefixed class names
  (`irt-<File>-module__<class>__<hash>`), extracted into a single
  `dist/styles.css` together with `tokens.css`. JS does not import CSS; apps
  import `@itsrighttime/irt-ui/styles.css` once (works in Next.js App Router).
- **Types**: `vite-plugin-dts` emits `.d.ts` per module; specifiers are
  rewritten to `.js` so `moduleResolution: bundler` **and** `node16/nodenext`
  consumers resolve them (`attw` verifies). `styles.css` has a `.d.ts` stub.
- **Externals**: all peer and runtime dependencies (`react`, `react-dom`,
  `lucide-react`, `clsx`, markdown peers) — no duplicate React.

## Client boundaries / SSR

- Every component with state, effects, refs or internal event handlers has
  `"use client"`.
- No browser globals during render. `window`/`document` are used only in
  effects and event handlers; portals render after mount (`useIsMounted`) so
  server and first client render match.
- Route highlighting uses `currentPath` passed by the app (no `location`).
- `ThemeProvider` writes its CSS into a `<style>` element during render, so
  SSR output already contains the theme (including `system` dark mode).
- Locale-dependent output (Calendar month names) uses a fixed default locale
  (`en-US`) to avoid server/client differences; pass `locale` to change it.

## Icons

`icons/registry.ts` maps semantic names → components (named lucide imports,
so only used icons are bundled). `IconName` is derived from the registry.
Components accept `IconLike = IconName | LegacyIconName | ReactNode`.
`<IconProvider icons={{ close: MyClose }}>` overrides implementations at
runtime; replacing the registry file swaps icons library-wide. Legacy host-app
names (`crossIcon`, `logoutIcon`, …) resolve through `legacyIconAliases` for
one major version.

## Component conventions

- `setResult(value)` callbacks are kept for backwards compatibility.
- Value props re-sync when the parent changes them (`useSyncedState`), so a
  static `value` behaves as a default and a parent-managed value stays in control.
- `BaseProps` (`size`, `radius`, `color`, `width`, `height`, `disabled`,
  `loading`, `tooltip`, `ariaLabel`, `className`, `style`, `id`) is shared.
- Defaults resolve as: prop → `theme.components.*` → built-in.
- Accessibility: native elements where possible, ARIA roles for composite
  widgets (combobox/listbox, menu, tablist, dialog, switch), focus trapping in
  modal surfaces, visible focus rings via `--irt-color-focus`.

## Lint policy

`typescript-eslint` strict + `react-hooks`. `no-explicit-any` is an error
(the codebase has none). The React-Compiler rules `react-hooks/refs` and
`react-hooks/set-state-in-effect` are warnings: the library supports React 18,
so it deliberately uses the "latest ref" pattern (instead of `useEffectEvent`)
and prop→state sync effects.

## Testing

- Unit/integration: Vitest + jsdom + Testing Library (`npm test`), one test
  file per component family plus theme/icon/token tests.
- Package: `publint` + `@arethetypeswrong/cli` on the packed tarball.
- Apps: `examples/react` (React 18, Vite) and `examples/nextjs` (React 19,
  App Router, SSR/SSG) install the tarball; `examples/react/src/types.check.tsx`
  asserts public typings with `@ts-expect-error`. CI runs all of it.

## Playground

`playground/` is a Vite app documenting the library with the library
(the shell is a `Workspace`, controls are library inputs). Its Vite config
aliases `@itsrighttime/irt-ui[/…]` to `src/`, so pages always reflect the
current source and use the exact import paths consumers use. Routing is
hash-based (`#/components/button`) because GitHub Pages serves one static
`index.html`. Component pages are data: each `DocEntry`
(`playground/src/docs/entries/*.tsx`) declares controls, a `render(values)`
preview and a `code(values)` snippet generator. The theme builder edits a
`ThemeConfig` held in context (persisted to `localStorage`) that feeds the
root `ThemeProvider`, so the whole site re-themes live.
