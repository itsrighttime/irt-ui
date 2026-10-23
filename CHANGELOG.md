# Changelog

## Unreleased — production polish

All changes are backwards compatible at the API level (no props removed or renamed).
Visual defaults that changed are listed under **Visual changes** so you can review them.

### New
- **`Tabs`** — accessible content tabs / segmented control (`underline`, `pills`, `enclosed`; icons, badges, disabled tabs, controlled or uncontrolled, ←/→/Home/End).
- **`Badge`** — status label / count (six tones, `soft` / `solid` / `outline`, `dot`, `icon`; server-component safe).
- **`useScrollLock(active)`** hook; `borderStrong` colour token (`--irt-color-border-strong`).
- 17 icons: `arrowUpDown cloudUpload columns download edit file filter folder heart image inbox moreHorizontal music share star users video`.

### Component APIs (additive)
- **Button** — real hover/active states for every variant, control heights from `theme.layout.control.height`, `loading` class.
- **IconButton** — `variant` (`ghost` default, `soft`, `solid`, `outline`, `plain`), `shape`, `active` (`aria-pressed`). `isBorder` maps to `outline`.
- **PlainButton** — `iconLeft`, `iconRight`, `ariaLabel`, `id`.
- **TextInput** — height on the field (helper text no longer overlaps), focused/invalid label colours, hover border, click-to-focus padding.
- **TextArea** — `onValueChange`, `minRows`, `resizable`, `helperText`, `error`, `ariaLabel`, `className`; counters read "12 / 200 characters · 3 words".
- **JsonField** — `indent`, `saveLabel`; parser error message shown; saved state has an Edit button.
- **AddressInput** — `columns`, `legend` (`<fieldset>`), `labels`, `requiredFields`, `errors`, `autoComplete` tokens.
- **SearchBox** — `variant`, `clearable`, `emptyText`, `defaultQuery`, `renderSuggestion`, `onQueryChange`, match highlighting.
- **Dropdown** — option objects `{ value, label, description, icon, disabled }`, `helperText`, `error`, `size`, `block`, `searchable`, `searchPlaceholder`, `emptyText`, `maxMenuHeight`, `ariaLabel`, `onOpenChange`, `floatingLabel`, `id`, `className`; Home/End/Backspace keys.
- **CheckboxGroup / RadioGroup** — `helperText`, `error`, `variant="card"`, `id`, `className`.
- **DropdownSimple** — item `icon` and `danger`, `onClose` (Escape/Tab), Home/End, `className`.
- **Switch** — `size`, `labelPosition`, `spread`, `description`, `ariaLabel`, `className`.
- **Slider** — `showButtons`, `formatValue` (+ `aria-valuetext`), `helperText`, `id`, `className`.
- **Stepper** — segmented control; value is a `spinbutton` (arrows, PageUp/Down, Home/End); `size`, `align`, `formatValue`, `helperText`, `className`.
- **Calendar** — `value` (selection highlight), separate today marker, `highlightToday`, `firstDayOfWeek`, arrow-key grid navigation, `className`.
- **Date pickers** — portal popover that flips, `formatValue`, `clearable`, `helperText`, `error`, `compact`, `firstDayOfWeek`; value highlighted in the calendar.
- **TimePicker** — single-field segments with ↑/↓ stepping, `helperText`, `error`.
- **Alert / AlertContainer** — type icons, `title`, `icon`, `action`, `dismissible`, `className`; countdown pauses on hover/focus; container `position`.
- **Modal** — `title`, `description`, `footer`, `size`, `width`, `lockScroll`; close button inside the panel; drags starting inside never close it.
- **Dialog** — `showLabels`, `width`, `footer`, `closeOnOverlayClick`, `closeOnEscape`, `lockScroll`; arrow-key tabs.
- **Tooltip** — opens on keyboard focus only (not programmatic focus).
- **Table** — `title`, `toolbar`, `searchPlaceholder`, `density`, `striped`, `stickyHeader`, `maxHeight`, `loading`, `className`; columns `align` / `width`; actions `icon`, `iconOnly`, `variant`, `hidden`, `disabled`; range + pager footer.
- **DataTableWithActions** — `dialogShowLabels`, `tableProps`.
- **DataSnapshotViewer** — redesigned drawer, scroll lock.
- **Uploads** — shared drop zone (icon, title, derived limits hint), file rows with type icon and size; `dropzoneText`, `hint`, `helperText`, `disabled`, `className`; `ImageUpload`/`ImagePreview` `fit`; `VideoPlayer`/`ImagePreview` `emptyText`; `AudioPlayer` `title`, hover time on seek.
- **ErrorPage** — `as` (`main` default / `section` / `div`), `fullHeight`, `title`, `description`, `actions`, `color`, `className`, `style`.
- **Markdown** — theme-aware highlighting (one-light / one-dark), code block header with language + Copy, token-based typography, safe against host `code` styles.
- **Workspace** — `barSize`, `sidebarWidth`, `leftSidebarOpen` / `rightSidebarOpen` + `onSidebarOpenChange`, `overlayBreakpoint` (drawer sidebars), `skipLinkLabel`, `contentClassName`, `contentStyle`. TabBar arrow-key navigation, `disabled` text/icon tabs, sidebar group `icon`, refreshed active styles.
- **cssVars** — undefined `--irt-c-*` values now reset to `initial`, so component-local variables never leak into nested components (fixed huge Stepper buttons and the password toggle).

### Visual changes to review
- `PlainButton` default colour is `primary` (was `accent`, low contrast).
- `IconButton` default is `ghost` (transparent, small padding) instead of a background-coloured box.
- Modal / Dialog / drawer close buttons are neutral ghost icons instead of red circles.
- Single-select Dropdown shows the selected label without a count chip.
- `ErrorPage` uses `min-height` and a smaller responsive code size; `IconError` has a dashed placeholder frame.
- Inline copy changed: FileUpload footer ("2 of 3 files", "Add more", "Remove all"), placeholders "Image not available" / "Video not available".

### Playground
Grouped controls with change markers and hints, segmented selects, preview toolbar (canvas background, 768/375 viewports, remount), Code / Props / Events tabs, prop tables generated from the TypeScript types (`npm run docs:props`), syntax highlighting, example galleries, a filterable catalogue page, responsive drawer navigation and a callback events log replacing inline debug output.
