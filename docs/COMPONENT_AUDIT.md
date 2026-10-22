# Component Audit — irt-ui

_Phase 1 output · audited 2026-10-22 · source: `atoms/` and `layouts/` (156 files, ~8.9k lines of TS/TSX)_

Status legend: **Pending** (not started) · **Blocked** (needs external source or decision) · **Done**

> **Update 2026-10-22:** all entries below are migrated. The tables describe the state *found* in Phase 1 and the action taken; see `MIGRATION_PROGRESS.md` for verification results and `MIGRATION_GUIDE.md` for consumer-facing changes. Paths in the tables are the original (pre-move) paths.

## 1. Repository snapshot

| Item | Finding |
|---|---|
| Root contents | `atoms/`, `layouts/` only (+ this `docs/`) |
| `package.json` / `tsconfig` / lint / build / tests | **None** — the folders are lifted out of a host app |
| Barrels | `atoms/index.tsx` (50 `export *`), `layouts/index.tsx`, `layouts/workspace/index.tsx` |
| Styling | CSS Modules (`*.module.css`) + inline `--var` overrides; ~60 distinct CSS variables expected from the host app's global stylesheet (none defined here) |
| Icons | `Icons` object from host app (`@/assets/icons`) — values are ReactNodes; ~40 names used |
| `"use client"` | Present on 47 files, missing on several hook-using files (see §4) |
| `any` usages | 43 (mostly `["--var" as any]` CSS-variable casts) |
| Planning notes | `atoms/todo`, `layouts/todo`, `layouts/docs/01-ws-config.md` (describes an unimplemented `buildWorkspace` engine) |

### 1.1 Unresolved external imports (host-app aliases)

These do not exist in this repo and block a standalone build.

| Import | Used by | Needed for |
|---|---|---|
| `@/assets/icons`, `@/assets` (`Icons`, `IconTypes`) | 22 files | All icons → replace with central icon system |
| `@/types` (`BaseProps`), `@/types/atoms/base-props` (`OmitProp`) | Button, TextInput, CalendarInput, OtpField, TimePicker | Shared prop contract. **Re-created** in `src/types/base-props.ts` from usage (original source not available) |
| `@/hooks` (`useSmartPosition`) | Tooltip, DropdownSimple | Viewport-aware placement. **Re-implemented** in `src/hooks/useSmartPosition.ts` from its call contract |
| `@/core-ui` (`logger`, `apiCaller`, `fromKebabCase`, `useAuth`, `useWsHandlers`) | OtpField, Dialog, Workspace | App services → remove from library |
| `@/atoms`, `@/atoms/` (self-alias) | DataTableWithActions, Tab* | Replace with relative imports |
| `react-router-dom` (`useNavigate`, `useSearchParams`, `Outlet`) | ErrorPage, Dialog, DataTableWithActions, Workspace | Routing → replace with callbacks / slots |

### 1.2 Third-party dependencies in use

| Package | Used by | Proposed handling |
|---|---|---|
| `react`, `react-dom` | all | `peerDependencies` (>=18) |
| `clsx` | Button, TextInput | keep as dependency (tiny) — or internal `cx()` util |
| `react-markdown`, `remark-gfm`, `react-syntax-highlighter` | Markdown | optional peers; isolate in `@org/ui/markdown` sub-entry so the core stays light |
| `react-router-dom` | 4 files | **remove** |
| `lucide-react` | — (new) | dependency of the icon registry |

## 2. Component inventory

### 2.1 Atoms

| # | Component(s) | Path | Purpose | Internal deps | External deps | Exported? | Issues | Action | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `Alert` | alert/Alert.tsx | Auto-dismiss toast (10 s) with progress bar | IconButton | Icons | **No** | Hardcoded `#fff`/`#ff5969`; duplicate `AlertType`; no `role="alert"`/`aria-live`; fixed timer | Refactor, export, add `duration` | Done |
| 2 | `AlertContainer` | alert/AlertContainer.tsx | Renders alert stack | Alert | — | Yes | index-based keys | Standardize | Done |
| 3 | `ErrorMsg` | alert/ErrorMsg.tsx | Inline error text | — | — | Yes | Uses legacy vars `--colorRed`, `--boldL2`, `--size`; `as any` | Tokenize | Done |
| 4 | `Button` | button/Button.tsx, Button.types.ts | Polymorphic button: variants, sizes, icons, loading, tooltip | Tooltip | `BaseProps`, clsx | Yes | `Ref<any>`; always wrapped in Tooltip even w/o tooltip; no `"use client"` | Type refs, conditional Tooltip, tokenize | Done |
| 5 | `IconButton` | button/IconButton.tsx | Icon-only button (node or image URL) | Tooltip | — | Yes | No `ref`; no `aria-label` (label only in tooltip); size as string multiplier; `as any` vars | Accept `IconName \| ReactNode`, a11y, forwardRef | Done |
| 6 | `PlainButton` | button/PlainButton.tsx | Text/link-style button | — | — | Yes | Hardcoded `#52C9BD`, default text "Click Me", no `children`/`disabled` | Tokenize, add children | Done |
| 7 | `Calendar` | calendar/Calendar.tsx (+RenderDates/Months/Years, helpers) | Date/day/month/month-year/year picker grid | Loading, IconButton | Icons | Yes | **Month emitted 0-based** in `dd-mm-yyyy` while parser expects 1-based; throws on bad range; `.tsx`/`.js` import extensions; `"use client"` on a pure helper; hardcoded English weekdays; no keyboard nav | Fix date contract (decision), a11y grid | Done |
| 8 | `DatePicker`, `DayPicker`, `MonthPicker`, `MonthYearPicker`, `YearPicker` | calendar/CalendarInput.tsx | Input + popup Calendar | Calendar | `BaseProps` | Yes | `setResult(any)`; no `"use client"`; not portaled; not keyboard-accessible | Type values per mode, client boundary | Done |
| 9 | `ErrorPage` | error/ErrorPage.tsx, error.ts | Full-page HTTP error view | — | react-router, Icons | Yes | Router coupling; hardcoded colours; empty `<span className="boldL2">` | Replace with `onNavigate` callback | Done |
| 10 | `IconError` | error/IconError.tsx | Icon + message empty state | — | — | Yes | — | Tokenize | Done |
| 11 | `Loading` | loading/Loading.tsx | Loader switcher (5 styles) + animated text | LoadingStyle, LoadingChat, SecondaryLoading | — | Yes | `lazy()` for tiny components (unnecessary in a lib); fallback is 100vw×100vh | Static imports, `role="status"` | Done |
| 12 | `CubesLoader`, `FoldingLoader`, `BounceLoader`, `PulseLoader` | loading/LoadingStyle.tsx | Individual spinners | — | — | **No** | — | Export | Done |
| 13 | `LoadingChat` | loading/LoadingChat.tsx | Gooey blob loader | — | — | Yes | SVG filter `id="goo"` collides if rendered twice | `useId()` | Done |
| 14 | `LoadingBorder` | loading/LoadingBorder.tsx | Animated border wrapper | — | — | **Broken** (default export lost via `export *`) | Hardcoded rgba/`#fff` | Named export, tokenize | Done |
| 15 | `SecondaryLoading` | loading/SecondaryLoading.tsx | Full-viewport cubes | LoadingStyle | — | Yes | Inline viewport sizing | Standardize | Done |
| 16 | `MarkdownRenderer` | markdown/* | GFM markdown with syntax highlight & tables | — | react-markdown, remark-gfm, react-syntax-highlighter | Yes | `as any` for components; `.jsx` import; types redefine DOM `Node` | Separate entry, type via `Components` from react-markdown | Done |
| 17 | `OtpField` | opt/OtpField.tsx | N-digit OTP input with paste | — | **`apiCaller`, `logger`** | Yes | **Business logic in atom** (POSTs to endpoint); effect missing deps; `err: any` | Replace with `onComplete`/`verify` callback | Done |
| 18 | `Dialog` | over/Dialog.tsx | Tabbed modal with icon nav, URL-synced tab | IconButton, Tooltip | react-router, `fromKebabCase`, Icons | Yes | Router coupling; no focus trap / `role="dialog"`; `document.body` at render (SSR); no `"use client"` | Controlled `activeKey` props, portal guard, a11y | Done |
| 19 | `DynamicPopover` | over/DynamicPopOver.tsx | Portal popover with flip (render-prop) | — | — | Yes | Duplicates Popover logic; `zIndex: 9999` hardcoded | Merge with Popover via shared hook | Done |
| 20 | `Modal` | over/Modal.tsx | Overlay modal | IconButton | Icons | Yes | No focus trap/`aria-modal`; legacy `--colorRed` | a11y, tokens | Done |
| 21 | `Popover` | over/Popover.tsx | Portal anchored popover | — | — | Yes | See DynamicPopover | Shared `usePopoverPosition` | Done |
| 22 | `SearchBox` | search/SearchBox.tsx, Search.helper.ts | Autocomplete (≥3 chars) | Button | Icons | Yes | Fixed DOM ids (`suggestions-list`, `suggestion-n`) collide across instances; missing `role="combobox"` | `useId()`, ARIA combobox | Done |
| 23 | `SelectionBox` | slection/SelectionBox.tsx | Checkbox/radio renderer | IconButton | Icons | **No** (internal) | Not native inputs (no form/keyboard semantics); `#bbb9b9`; `aria-labelledby={label}` misuse | Native inputs or ARIA roles | Done |
| 24 | `CheckboxGroup` | slection/CheckboxGroup.tsx | Multi-select group | SelectionBox | — | Yes | Loose `setResult` union type | Tighten types | Done |
| 25 | `RadioGroup` | slection/RadioGroup.tsx | Single-select group | SelectionBox | — | Yes | Same | Tighten types | Done |
| 26 | `Dropdown` | slection/Dropdown.tsx | Searchable single/multi select, add-new | IconButton, Button, DynamicPopover, getFittedText | Icons | Yes | `label` prop declared but unused; `as any` refs; passes `width` to Button; `latestPlacementRef` mutated in render; no listbox ARIA | Type fixes, a11y | Done |
| 27 | `SingleDropdown`, `MultipleDropdown` | slection/Dropdowns.tsx | Dropdown presets | Dropdown | — | Yes | — | Standardize | Done |
| 28 | `DropdownSimple` | slection/DropdownSimple.tsx | Menu list (used by TabDropdown) | — | `useSmartPosition` | Yes | Clickable `div`s, no keyboard | a11y (`role="menu"`) | Done |
| 29 | `Slider` | slider/Slider.tsx | Range slider with ± buttons | Button | Icons | Yes | **± buttons don't call `setResult`**; prop sync only when internal value is 0; DOM style mutation | Fix emit, controlled pattern | Done |
| 30 | `Stepper` | stepper/stepper.tsx | Numeric ± stepper | Button | Icons | Yes | Same sync bug; lowercase file name | Rename file, fix sync | Done |
| 31 | `Switch` | switch/Switch.tsx | Toggle with label | — | — | Yes | Ignores later `value` changes; label not associated | Controlled/uncontrolled | Done |
| 32 | `Table` | table/Table.tsx (+ Header/Body/Row/Cell/Controls/Pagination/ColumnSelector/ActionColumn) | Data table: search, column picker, pagination, row actions, row viewer | TextInput, Dropdown, Popover, IconButton, Button, DataSnapshotViewer | Icons | Yes | Uses hooks w/o `"use client"`; column toggle by `title` but init by `key`; `Record<string, any>`; index keys; `sortable` declared but unimplemented; `totalPages` can be 0 | Types, client boundary, key fixes | Done |
| 33 | `DataTableWithActions` | table/DataTableWithActions.tsx | Table + URL-driven Dialog | Table, Dialog | react-router, `@/atoms` self-import | Yes | Router coupling; circular barrel import; `closeDialog` no-op | Controlled props | Done |
| 34 | `TextInput` | text-input/TextInput.tsx, .types.ts | Base input: variants, icons, floating label, password toggle | Button | `BaseProps`, `OmitProp`, clsx, Icons | Yes | `placeholder` prop silently discarded; `value?.length` unsafe on number; no `"use client"` (uses state) | Fix props, client boundary | Done |
| 35 | `EmailInput`, `MobileInput`, `NumberInput`, `PasswordInput` | text-input/*.tsx | TextInput presets | TextInput | Icons | Yes | NumberInput sets `autoComplete="cc-number"` (wrong) | Fix | Done |
| 36 | `UrlInput` | text-input/UrlInput.tsx | URL input with favicon preview | TextInput | Icons | Yes | Ignores `value` prop (uncontrolled only); calls **Google favicon service** (privacy/CSP) | Make favicon resolver opt-in prop | Done |
| 37 | `AddressInput` | text-input/AddressInput.tsx | Composite address fields | TextInput | — | Yes | Inline styles | Tokenize | Done |
| 38 | `TextArea` | text-input/TextArea.tsx | Auto-resize textarea with counts | — | — | Yes | `id={label}` (spaces/collisions); `maxLength` blocks input but `minLength` doesn't | `useId()` | Done |
| 39 | `JsonField` | text-input/JsonField.tsx, getCommonCssVariables.ts | JSON editor with validate & save | TextArea, Button | — | Yes | `var(--color-primary` missing `)`; `any` params; `console.error` | Fix, type | Done |
| 40 | `TimePicker` | time/TimePicker.tsx (+ CustomDropdown) | 12h time picker with min/max/steps | CustomDropdown | `BaseProps` | Yes | **`setResult` destructured twice → emits twice**; hour options wrong for `hourStep>1` (starts at 01) | Fix | Done |
| 41 | `Tooltip` | tooltip/Tooltip.tsx, .types.ts | Hover/focus tooltip via Popover | Popover | `useSmartPosition` | Yes | `cloneElement(... as any)` overwrites child's own handlers/ref; duplicated prop type in `.types.ts`; no `role="tooltip"`/`aria-describedby` | Compose handlers & refs, a11y | Done |
| 42 | `FileUpload` | uploads/FileUpload.tsx (+ helpers) | Multi-file drag & drop | IconButton | Icons | Yes | `onchange as any`; clickable `<p>`s | a11y, types | Done |
| 43 | `ImageUpload` | uploads/ImageUpload.tsx | Image upload with square check | IconButton | Icons | Yes | `value: ... \| any`; `backendError` unused; object-URL leaks | Types, cleanup | Done |
| 44 | `ImagePreview` | uploads/ImagePreview.tsx | Image/File preview with fallback | IconError | Icons | Yes | Hardcoded `#f8f8f8`, legacy `--colorGray3` | Tokenize | Done |
| 45 | `VideoUpload` | uploads/VideoUpload.tsx | Video upload | VideoPlayer, IconButton | Icons | Yes | `.js` import extensions | Standardize | Done |
| 46 | `VideoPlayer` | uploads/VideoPlayer.tsx | Video preview | IconButton, IconError | Icons | Yes | **Creates object URL every render (leak)**; typo "Looks live" | `useMemo`+cleanup | Done |
| 47 | `AudioUpload` | uploads/AudioUpload.tsx | Audio upload | AudioPlayer | — | Yes | `e: any`; object-URL leak in `processFile` | Types, cleanup | Done |
| 48 | `AudioPlayer` | uploads/AudioPlayer.tsx | Custom audio player | IconButton, Slider | Icons | Yes | `play()` promise unhandled; seek bar not keyboard-accessible | a11y | Done |
| 49 | `DataSnapshotViewer` | viewer/DataSnapshotViewer.tsx | Drawer showing a flattened record | IconButton | Icons | **No** | **`useMemo` after early return (Rules of Hooks)**; numeric strings rendered as dates; `en-IN` locale hardcoded | Fix hook order, `locale` prop | Done |

### 2.2 Layout (`layouts/workspace`)

| # | Component / module | Path | Purpose | Issues | Action | Status |
|---|---|---|---|---|---|---|
| 50 | `Workspace` | layout/Workspace.tsx | 10-slot app shell (top/bottom/left/right bars, sidebars, content) | **App-coupled**: `useAuth`, `useWsHandlers`, `Outlet`, `useNavigate`, hardcoded config via `useWorkspace`; throws on invalid config; injects user-name tab | Make config/children/`onNavigate`/`onAction`/`currentPath`/slot props; no router | Done |
| 51 | `TabBar` | bars/TabBar.tsx | Renders start/center/end tab sections | `tab: any`; relies on `isActive` (global `location`) | Typed handler, active-route via context | Done |
| 52 | `TabText`, `TabIcon`, `TabLabel`, `TabDropdown`, `TabCustom` | bars/*.tsx | Tab renderers | `Icons[icon]` string lookup (good — maps to `IconName`); TabText truncates at 15 chars in JS; TabLabel static icons rendered as buttons; TabIcon/TabText lack `"use client"` | Use `<Icon>`, CSS ellipsis (per todo) | Done |
| 53 | `Sidebar` | sidebars/Sidebar.tsx | Nested collapsible nav groups | Clickable `div`s; `position: string` untyped | a11y (`nav`, buttons, `aria-expanded`) | Done |
| 54 | `renderBar` | layout/renderBar.tsx | Helper to build TabBar | — | Keep internal | Done |
| 55 | `validateWorkspaceConfig` | layout/validateWorkspaceConfig.helper.ts | Slot rule validation | `tab: any`, `as any` | Type with `TabConfig` | Done |
| 56 | `filterWorkspace` | config/ws.ts | Visibility filtering | — | Keep as exported util | Done |
| 57 | `useWorkspace` | layout/useWorkspace.tsx | Active tab + filtered config | Imports **app data** (`ws.config.ts`, `ws.visibility.ts`) | Accept config & visibility map as args | Done |
| 58 | `ws.config.ts`, `ws.visibility.ts`, `workspace.hook.ts` | config/, layout/ | Hardcoded app nav (routes `/workspace/...`, "Lead Management") | Application data, `workspace.hook.ts` is dead code | Move to `examples/`, delete dead hook | Done |
| 59 | Constants: `TAB_TYPE`, `TAB_ORIENTATION`, `WORKSPACE_SLOTS`, `ScreenType` | const/ | Enum-like consts | `ScreenType` unused | Keep, export | Done |
| 60 | `isActive` | helper/isActive.ts | Route matching | **Reads global `location` during render → SSR crash & hydration mismatch**; assumes a 1-segment base prefix (`index + 1`) | Replace with `currentPath` + `basePath` via context | Done |

**Broken export:** `layouts/index.tsx` does `export * from "./layout"` — no such folder at that level (it is `./workspace/layout`). `TabBar`, `Sidebar`, and the consts are not exported at all.

## 3. Icon inventory (names to seed the registry)

From `Icons.*` usage and workspace configs (current host-app names → proposed semantic name):

`crossIcon→close`, `arrowLeftIcon→chevronLeft`, `arrowRightIcon→chevronRight`, `arrowDownIcon→chevronDown`, `arrowUpIcon→chevronUp`, `plusIcon→plus`, `minusIcon→minus`, `searchIcon→search`, `linesIcon→menu`, `eyeIcon→eye`, `eyeCrossIcon→eyeOff`, `MailIcon→mail`, `callIcon→phone`, `LinkIcon→link`, `lockIcon→lock`, `keyIcon→key`, `userIcon→user`, `profileIcon→userCircle`, `bellIcon/BellIcon→bell`, `ActivityIcon→activity`, `warningIcon→alertTriangle`, `warningTimeIcon→clockAlert`, `warningWifiIcon→wifiOff`, `squareIcon→checkboxOff`, `squareFilledIcon→checkboxOn`, `circleThikIcon→radioOff`, `cirlceFilledIcon→radioOn`, `playIcon→play`, `pauseIcon→pause`, `speakerOnIcon→volume`, `speakerOffIcon→volumeOff`, `resetFieldIcon→refresh`, `imageNotIcon→imageOff`, `videoNotIcon→videoOff`, `logoutIcon→logout`, `homeIcon→home`, `DocumentIcon→fileText`, `LeadIcon→target`.

A legacy-name alias map can be kept for one major version so existing `TabConfig.icon` strings continue to work.

## 4. Cross-cutting problems

1. **Not standalone** — 6 host-app aliases (§1.1); `BaseProps` and `useSmartPosition` sources are needed to preserve behaviour.
2. **App/business logic inside atoms** — OtpField (API call), Workspace (auth, handlers, nav config), Dialog/DataTableWithActions/ErrorPage (router).
3. **No theme layer** — components consume ~60 un-prefixed globals (`--color-primary`, `--spacing-sm`…) plus legacy camelCase ones (`--colorRed`, `--colorGray3`, `--boldL2`, `--size`, `--font-weght-bold` typo) that the library never defines. ~35 hardcoded colours, z-indexes 100–9999 scattered.
4. **SSR / Next.js** — global `location` in render (isActive); `document.body` passed to `createPortal` during render (Modal, Dialog, Popover — safe only because they return `null` when closed); missing `"use client"` in Button, TextInput, CalendarInput, Dialog, Table*, DataSnapshotViewer, TabIcon/TabText (stateful or event-handler components imported from server components will fail); `"use client"` on a pure helper.
5. **Type safety** — 43 `any`; inconsistent `setResult` callback types; duplicated prop types (Tooltip, Alert, Loader).
6. **Controlled/uncontrolled bugs** — Slider, Stepper, Switch, Dropdown, FileUpload only sync from props once (or when internal value is empty).
7. **Accessibility** — clickable `div`/`p`/`li` without roles or keyboard support (Sidebar, DropdownSimple, SelectionBox, FileUpload actions, Calendar cells); no focus management in Modal/Dialog; fixed DOM ids.
8. **Correctness bugs** — Calendar 0-based month in output, TimePicker double emit, DataSnapshotViewer hook order, VideoPlayer URL leak, JsonField CSS typo, NumberInput autocomplete.
9. **Barrel issues** — broken `layouts/index.tsx`; default export lost (LoadingBorder); several components not exported (Alert, SelectionBox, loaders, DataSnapshotViewer, TabBar, Sidebar); self-alias `@/atoms` imports create cycles.
10. **Naming** — folder typos (`slection`, `opt`, `helperCalnedar`, `getFileType.heper`), mixed casing (`stepper.tsx`), mixed `.type.ts`/`.types.ts`.
