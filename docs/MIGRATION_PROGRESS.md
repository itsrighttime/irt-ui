# Migration Progress

_Last updated: 2026-10-22 (playground + deploy branch added)._

**Resume point:** implementation complete and verified locally. Remaining items
are decisions/actions for the maintainers (see "Open items") — nothing has been
pushed or published.

## Open items (need a maintainer decision or action)
- [x] Package name/scope `@itsrighttime/irt-ui` matches the GitHub owner (`itsrighttime/irt-ui`).
- [ ] Calendar month numbering: keep legacy 0-based default or switch to `monthBase={1}` by default (breaking) — see MIGRATION_GUIDE §4.
- [ ] `BaseProps` and `useSmartPosition` were re-created from usage because the host-app sources were not available; compare with the originals if exact parity matters.
- [ ] Default palette was derived from hardcoded values in the old components (teal `#52C9BD`, danger `#ff5969`, navy text) — align with the brand.
- [x] GitHub repo created and `main` pushed.
- [ ] Enable **Settings → Pages → Source: GitHub Actions**, then push `main` to the `deploy` branch for the first package publish + Pages deployment.
- [ ] Confirm the license — the repository is public but `LICENSE` is proprietary.
- [ ] Visual review of each component against the old app (automated tests cover behaviour, not pixels).

## Foundation
- [x] Repository audit (`COMPONENT_AUDIT.md`)
- [x] Migration plan (`MIGRATION_PLAN.md`)
- [x] Package architecture — sources moved to `src/` with `git mv` (history kept); git repo initialised
- [x] Shared types/hooks/utils — `BaseProps`, `useSmartPosition`, `useControllableState`, `useSyncedState`, `useFocusTrap`, `useClickOutside`, `useEscapeKey`, `useIsMounted`, `cssVars`, `cx`, `mergeRefs`, `fromKebabCase`
- [x] Theme system — typed tokens, `ThemeProvider` (global/local scope, light/dark/system, runtime switching, validation, SSR-safe), generated `tokens.css`
- [x] Icon system — lucide registry, `Icon`, `IconProvider`, legacy aliases, `renderIcon`
- [x] Build configuration — Vite lib (preserveModules, `"use client"` preservation, single `styles.css`, d.ts with `.js` specifiers)

## Components — atoms
- [x] Tooltip
- [x] Button · IconButton · PlainButton
- [x] Loading · LoadingBorder · LoadingChat · Cubes/Folding/Bounce/PulseLoader · SecondaryLoading
- [x] Alert · AlertContainer · ErrorMsg
- [x] ErrorPage · IconError
- [x] Switch · Slider · Stepper
- [x] Popover · DynamicPopover · Modal · Dialog
- [x] TextInput · EmailInput · MobileInput · NumberInput · PasswordInput · UrlInput · AddressInput
- [x] TextArea · JsonField
- [x] OtpField
- [x] SearchBox
- [x] SelectionBox · CheckboxGroup · RadioGroup
- [x] Dropdown · SingleDropdown · MultipleDropdown · DropdownSimple
- [x] Calendar · DatePicker · DayPicker · MonthPicker · MonthYearPicker · YearPicker
- [x] TimePicker (+ CustomDropdown)
- [x] DataSnapshotViewer
- [x] Table · Pagination · DataTableWithActions
- [x] FileUpload · ImageUpload · ImagePreview
- [x] VideoUpload · VideoPlayer · AudioUpload · AudioPlayer
- [x] MarkdownRenderer (separate entry `@itsrighttime/irt-ui/markdown`)

## Components — layout
- [x] Workspace (decoupled from router/auth/app config)
- [x] TabBar · TabText · TabIcon · TabLabel · TabDropdown (TabCustom removed — unused)
- [x] Sidebar
- [x] Workspace utils: consts, `filterWorkspace`, `validateWorkspaceConfig`, `useWorkspace`, `matchRoute` (SSR-safe)
- [x] App-specific nav config moved to `examples/react/src/workspace.config.ts`

## Validation (all run on 2026-10-22)
- [x] TypeScript strict (`npm run typecheck`) — 0 errors
- [x] Lint (`npm run lint`) — 0 errors, 25 warnings (React-Compiler rules, see ARCHITECTURE "Lint policy")
- [x] Tests (`npm test`) — 21 files, 139 tests passing
- [x] Build + `.d.ts` (`npm run build`)
- [x] Package exports — `publint`: all good; `attw --profile esm-only`: no problems (bundler + node16)
- [x] React integration — `examples/react` (React 18.3, Vite) installed from tarball: typecheck incl. `@ts-expect-error` type assertions, build, browser run (theme, dark toggle, icon override, modal, dropdown, table sort) with no console errors
- [x] Next.js integration — `examples/nextjs` (Next 16.4 App Router, React 19) installed from tarball: `next build` (static prerender), server HTML contains theme CSS + components, browser hydration in light and dark color schemes with no hydration warnings; interactions verified

## Playground (GitHub Pages)
- [x] `playground/` app: getting started, theme builder (presets, colours light/dark, typography, radius/spacing, component defaults, JSON import, TS/JSON export + download, persisted), 41 component pages with live controls, generated usage code and prop tables, icon catalogue
- [x] Built from library source via package-path aliases; typechecked (`npm run typecheck:playground`)
- [x] Verified in Chromium (all 44 routes render, controls update preview + code, theme presets/colours/dark mode apply and persist, mobile layout)

## Distribution & docs
- [x] GitHub Actions — `ci.yml` (main/PRs: typecheck, lint, test, build, exports, playground build, example integration), `deploy.yml` (`deploy` branch: validate → publish if new version + tag → GitHub Pages)
- [x] GitHub Packages config — `publishConfig`, `.npmrc.example`, README instructions
- [x] README · ARCHITECTURE · THEME_GUIDE · MIGRATION_GUIDE · examples/README

## Local environment note
The migration was run from a Linux VM with this folder mounted from Windows;
dependencies were installed outside the folder (native binaries extracted onto
the mount were truncated). No `node_modules` is left in the folder — run
`npm install` (or `npm ci`) on your machine before using the scripts.
