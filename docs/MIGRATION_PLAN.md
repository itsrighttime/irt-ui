# Migration Plan — irt-ui → `@<scope>/ui`

_Proposed after Phase 1 and executed on 2026-10-22. Package name chosen: `@itsrighttime/irt-ui`._

**Deviations from the proposal (as built):**
- Component folders are grouped by family (`Button/`, `TextInput/`, `Selection/`, `Overlay/`, `Table/`, `Upload/`, …) rather than one folder per component, matching the original grouping.
- No `legacy.css` shim: old global variables are mapped in the theme instead (THEME_GUIDE §6); component-local variables are namespaced `--irt-c-*`.
- `Icon` is a client component (it reads `IconProvider` context).
- ESM-only output; declarations are node16-compatible.
- `setResult` APIs kept; value props re-sync via `useSyncedState` rather than a full controlled/uncontrolled split.

## 1. Target structure (adapted to the real inventory)

```text
irt-ui/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Alert/            Alert, AlertContainer, ErrorMsg
│   │   │   ├── Button/           Button, IconButton, PlainButton
│   │   │   ├── Calendar/         Calendar, DatePicker…YearPicker (+ internal Render*, date utils)
│   │   │   ├── ErrorPage/        ErrorPage, IconError
│   │   │   ├── Loading/          Loading, LoadingBorder, LoadingChat, Cubes/Folding/Bounce/PulseLoader, SecondaryLoading
│   │   │   ├── Overlay/          Modal, Dialog, Popover, DynamicPopover (shared usePopoverPosition)
│   │   │   ├── Otp/              OtpField
│   │   │   ├── Search/           SearchBox
│   │   │   ├── Selection/        CheckboxGroup, RadioGroup, SelectionBox, Dropdown, Single/MultipleDropdown, DropdownSimple
│   │   │   ├── Slider/  Stepper/  Switch/  Tooltip/  TimePicker/
│   │   │   ├── Table/            Table (+ internals), DataTableWithActions
│   │   │   ├── TextInput/        TextInput, Email/Mobile/Number/Password/UrlInput, AddressInput, TextArea, JsonField
│   │   │   ├── Upload/           File/Image/Video/AudioUpload, ImagePreview, Video/AudioPlayer
│   │   │   └── DataSnapshotViewer/
│   │   ├── layout/
│   │   │   └── Workspace/        Workspace, TabBar, Tab*, Sidebar, consts, filterWorkspace, validate, useWorkspace
│   │   └── index.ts
│   ├── markdown/                 MarkdownRenderer (separate entry; optional peers)
│   ├── theme/                    tokens/, types.ts, defaultTheme.ts, ThemeProvider.tsx, ThemeContext.ts, useTheme.ts, resolveTheme.ts, cssVars.ts
│   ├── icons/                    registry.ts, Icon.tsx, IconProvider.tsx, legacyAliases.ts, types.ts
│   ├── hooks/                    useSmartPosition, usePopoverPosition, useControllableState, useIsomorphicLayoutEffect, useClickOutside
│   ├── utils/                    cx, mergeRefs, deepMerge, fromKebabCase, formatFileSize, getFileTypeLabel
│   ├── types/                    BaseProps, common unions (Size, Radius, Variant)
│   ├── styles/                   tokens.css (default --irt-* vars), index.css
│   └── index.ts
├── docs/  examples/react  examples/nextjs  .github/workflows/
├── package.json  tsconfig.json  tsconfig.build.json  vite.config.ts  vitest.config.ts  README.md  LICENSE
```

Each component folder: `X.tsx`, `X.types.ts`, `X.module.css`, `index.ts`, `X.test.tsx`.

## 2. Key design decisions

| Area | Proposal |
|---|---|
| Build | Vite library mode, ESM only, `preserveModules` (keeps `"use client"` per file and enables tree-shaking), `vite-plugin-dts` for `.d.ts`; React/ReactDOM/lucide/markdown libs externalized; CSS Modules extracted to `dist/styles.css` |
| Entries | `.` , `./atoms`, `./layout`, `./theme`, `./icons`, `./markdown`, `./styles.css` |
| Theme | Typed `Theme` + `DeepPartial<Theme>` (`ThemeConfig`); `ThemeProvider` resolves default ← app ← mode (light/dark) and writes `--irt-*` CSS vars on a wrapper element (scoped, nestable, SSR-safe: vars are rendered inline, no `useEffect` flash). `styles/tokens.css` ships defaults on `:root` so components work without a provider. JSON config works as-is (it's a plain object). |
| CSS vars | Rename to `--irt-color-primary`, `--irt-space-sm`, … Legacy names (`--color-primary`, `--colorRed`, …) mapped once in a transitional `legacy.css` so host apps don't break immediately |
| Icons | `iconRegistry` (lucide, named imports only) → `IconName` union; `<Icon name size color strokeWidth title />`; `IconProvider icons={{ close: MyClose }}` overrides; `IconButton`/`Button` accept `IconName \| ReactNode`; legacy `xxxIcon` alias map |
| Routing | No router dependency. Workspace/TabBar/Sidebar get `currentPath`, `onNavigate(route)`, `onAction(payload)`, `children` (replaces `Outlet`), optional `renderLink`. Dialog gets controlled `activeKey`/`onActiveKeyChange` |
| API style | Keep `setResult` for v1 (no breakage); add standard `className`/`style`/`ref` where missing; controlled + uncontrolled via `useControllableState` |
| Client boundaries | `"use client"` on every stateful/interactive component file; pure types/utils/consts/theme tokens stay server-safe; `ThemeProvider` is a client component, `Icon` is server-safe |

## 3. Required dependencies

- **peer:** `react >=18`, `react-dom >=18`; optional peers: `react-markdown`, `remark-gfm`, `react-syntax-highlighter`
- **dependencies:** `lucide-react`, `clsx` (or drop for an internal `cx`)
- **dev:** `typescript`, `vite`, `@vitejs/plugin-react`, `vite-plugin-dts`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@types/react`, `@types/react-dom`, `@types/react-syntax-highlighter`, `eslint` + `typescript-eslint` + `eslint-plugin-react-hooks`, `publint`, `@arethetypeswrong/cli`
- **removed:** `react-router-dom`, all `@/…` aliases

## 4. Potential breaking changes for current consumers

1. Import path: `@/atoms` → `@<scope>/ui` (or `/atoms`, `/layout`).
2. Icon props: `Icons.crossIcon` nodes still accepted, but string names change (`"logoutIcon"` → `"logout"`; alias map softens this).
3. CSS variables renamed to `--irt-*` (legacy shim provided for one major).
4. `OtpField`: `verificationEndpoint`/`userId` removed → `onComplete(code)` / async `verify(code) => boolean`.
5. `ErrorPage`: string `handleNavigate` (router) → `onNavigate` callback.
6. `Dialog` / `DataTableWithActions`: URL search-param syncing moves to consumer via controlled props (an example adapter for react-router & Next will be documented).
7. `Workspace`: no longer reads auth/router/hardcoded config — consumer passes `config`, `children`, `onNavigate`, `currentPath`, optional `header` slot.
8. Bug fixes that change emitted values: Calendar month (0- → 1-based in `dd-mm-yyyy`, **needs decision**), Slider ± now emits, TimePicker emits once.
9. `LoadingBorder` becomes a named export.
10. Folder/file renames (internal unless deep-importing).

## 5. Recommended implementation order

1. **Foundation** — package.json, tsconfig(s), Vite+dts, Vitest, ESLint; move files into `src/` with `git mv` (history preserved), fix relative imports & barrels. Goal: `tsc --noEmit` runs (errors expected only from missing aliases).
2. **Shared internals** — recover `BaseProps`, `useSmartPosition` (needs source), add `cx`, `mergeRefs`, `useControllableState`, `fromKebabCase`.
3. **Theme system** — tokens derived from the 60 vars actually consumed, `ThemeProvider`, `tokens.css`, legacy shim, tests.
4. **Icon system** — registry seeded from §3 of the audit, `Icon`, `IconProvider`, aliases, tests.
5. **Leaf atoms** — Tooltip → IconButton/Button/PlainButton → Loading* → ErrorMsg/IconError → Switch → Slider/Stepper.
6. **Overlays** — Popover/DynamicPopover (merge positioning), Modal, Dialog.
7. **Inputs** — TextInput family, TextArea, JsonField, OtpField, SearchBox.
8. **Selection** — SelectionBox, Checkbox/RadioGroup, Dropdown family, DropdownSimple.
9. **Pickers** — Calendar + pickers, TimePicker.
10. **Data** — DataSnapshotViewer, Table, DataTableWithActions.
11. **Uploads/media** — FileUpload, Image*, Video*, Audio*.
12. **Markdown entry.**
13. **Layout** — de-couple Workspace (props/context), TabBar/Tab*/Sidebar, SSR-safe active route.
14. **Integration** — `npm pack`, examples/react (Vite) + examples/nextjs (App Router, SSR) installed from the tarball.
15. **CI & GitHub Packages** — workflows (typecheck, lint, test, build, publint/attw), release workflow gated on tags; docs.

Each step ends with typecheck + tests + an update to `MIGRATION_PROGRESS.md`.
