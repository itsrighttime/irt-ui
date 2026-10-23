# irt-ui — usage guide for AI coding agents

> **Audience:** Claude, Copilot, Cursor and other coding agents writing application code that
> *consumes* `@itsrighttime/irt-ui`. You cannot see the library source; this file is the
> contract. Everything here matches the published TypeScript declarations — when in doubt,
> trust the types in `node_modules/@itsrighttime/irt-ui/dist/**/*.d.ts`.
>
> Live demos of every component: https://itsrighttime.github.io/irt-ui/
> This file ships in the package at `node_modules/@itsrighttime/irt-ui/docs/AI_USAGE_GUIDE.md`
> and is published at https://itsrighttime.github.io/irt-ui/AI_USAGE_GUIDE.md.

**Wire it into a consuming project** (pick what your agent reads):

```md
<!-- CLAUDE.md (Claude Code imports @-paths) -->
UI: use the @itsrighttime/irt-ui component library for all UI. Follow:
@node_modules/@itsrighttime/irt-ui/docs/AI_USAGE_GUIDE.md

<!-- AGENTS.md / .cursor/rules / .github/copilot-instructions.md -->
Use @itsrighttime/irt-ui for all UI. Before writing UI code, read
node_modules/@itsrighttime/irt-ui/docs/AI_USAGE_GUIDE.md and follow it.
```

---

## 0. Ground rules (read first)

1. **Use library components before writing your own.** Buttons, inputs, selects, dates, modals,
   tables, uploads, alerts, loaders, tooltips, icons and the app shell all exist (see §4). Do
   not add another UI kit, icon pack or date picker.
2. **Import only from public entry points** (§2). Never deep-import `dist/...` files or
   `src/...` paths.
3. **Theme, don't hardcode.** Colours, spacing, radius, fonts, shadows and z-index come from the
   theme. In app CSS use `var(--irt-…)` tokens (§3.4), never literal hex values that duplicate
   the theme.
4. **Most value callbacks are named `setResult`**, not `onChange` (§1). Read each component's
   signature — some emit strings, some arrays, some on blur.
5. **Import the stylesheet once** (`@itsrighttime/irt-ui/styles.css`) and wrap the app in one
   `ThemeProvider` (§3).
6. **Use icon names** (`iconLeft="plus"`, `<Icon name="search" />`) from the registry (§5), not
   imported SVG components.
7. **Next.js App Router:** interactive library components are client components. Any component
   *you* write that passes event handlers or uses state must start with `"use client"` (§7).
8. **Accessibility is built in — keep it:** give icon-only buttons an `ariaLabel` (or
   `tooltip`), give `Modal` an `ariaLabel`, give inputs a `label` or `ariaLabel`.
9. **Widths:** most form components default to `width="300px"`. In forms and grids pass
   `width="100%"` (or a CSS length) explicitly.
10. **Dates:** always pass `monthBase={1}` to `Calendar` / `*Picker` so months are 1-based
    (`"05-10-2026"` = 5 Oct 2026). The default `0` exists only for legacy code.

---

## 1. Conventions shared by all components

| Convention | Meaning |
|---|---|
| `value` + `setResult(next)` | Value props **re-sync** when the parent changes them; a static `value` acts as an initial value. Keep the value in React state and pass `setResult={setX}`. |
| `setResult` timing | Immediate on change, **except** `TextArea` (on blur), `JsonField` (after "Validate & Save"), `OtpField` (when complete/verified), `TimePicker` (when hh, mm and AM/PM are all chosen and valid). |
| `BaseProps` | Many components accept `id`, `className`, `style`, `size` (`"small" \| "medium" \| "large"`), `radius` (`"none" \| "sm" \| "md" \| "lg"`), `color` (CSS colour or `var(--irt-…)`), `width`, `height`, `disabled`, `loading`, `tooltip`, `ariaLabel`, `responsive`. |
| Defaults precedence | library default → app `ThemeProvider` theme → `theme.components.*` defaults → component props → `className` / `style` (highest). |
| `IconLike` | Icon props accept a registry name (`"close"`) **or** any `ReactNode`. |
| `required` | Adds a visual `*` and `aria-required`; it does **not** validate — validate in your form logic. |
| `backendError` / `setIsFieldValid` | Upload and text-area components accept a server error string and report validity. |
| Refs | `Button`, `IconButton`, `TextInput` and its presets forward refs. |

---

## 2. Installation & entry points

```ini
# .npmrc in the consuming app (token needs read:packages; never commit it)
@itsrighttime:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @itsrighttime/irt-ui
# only if you use MarkdownRenderer:
npm install react-markdown remark-gfm react-syntax-highlighter
```

Peer deps: `react` / `react-dom` ≥ 18.2. ESM only.

| Import path | Use for |
|---|---|
| `@itsrighttime/irt-ui` | Everything except markdown (components, theme, icons, hooks, utils, types) |
| `@itsrighttime/irt-ui/atoms` | All atoms (buttons, inputs, selection, dates, overlays, table, uploads, feedback) |
| `@itsrighttime/irt-ui/layout` | `Workspace`, `TabBar`, `Sidebar`, workspace types and helpers |
| `@itsrighttime/irt-ui/theme` | `ThemeProvider`, `useTheme`, `ThemeConfig`, `Theme`, `themeVar`, `resolveTheme` |
| `@itsrighttime/irt-ui/icons` | `Icon`, `IconProvider`, `iconRegistry`, `IconName` |
| `@itsrighttime/irt-ui/markdown` | `MarkdownRenderer` |
| `@itsrighttime/irt-ui/styles.css` | All component CSS + default tokens — import once |

Pick one style per file; the root import is fine everywhere (tree-shaken).

---

## 3. Theme

### 3.1 Setup

```ts
// src/theme.ts
import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";

export const theme = {
  colors: { primary: "#7c3aed", onPrimary: "#ffffff", secondary: "#475569" },
  typography: { fontFamily: { base: "Poppins, system-ui, sans-serif" } },
  radius: { md: "10px" },
  components: { button: { size: "medium" }, input: { variant: "outline" } },
  dark: { colors: { primary: "#a78bfa", onPrimary: "#1e1033" } },
} satisfies ThemeConfig;
```

```tsx
// React: src/main.tsx  ·  Next.js: app/layout.tsx (server component is fine)
import "@itsrighttime/irt-ui/styles.css";
import { ThemeProvider } from "@itsrighttime/irt-ui/theme";
import { theme } from "./theme";

<ThemeProvider theme={theme} defaultMode="system">{children}</ThemeProvider>
```

Also give the page the theme background in global CSS:
`body { margin: 0; background: var(--irt-color-background); color: var(--irt-color-text); }`

- `ThemeConfig` = deep-partial `Theme` + optional `dark` overrides. Unknown keys are warned about in dev.
- A JSON file with the same shape works (`<ThemeProvider theme={json as ThemeConfig}>`).
- Generate a theme visually at https://itsrighttime.github.io/irt-ui/#/theme (exports `theme.ts`/`theme.json`).

### 3.2 `ThemeProvider` props

| Prop | Type | Notes |
|---|---|---|
| `theme` | `ThemeConfig` | Overrides, deep-merged over defaults |
| `defaultMode` | `"light" \| "dark" \| "system"` | Uncontrolled initial mode (default `"light"`) |
| `mode` / `onModeChange` | same | Controlled mode |
| `scope` | `"global" \| "local"` | Outermost provider defaults to global (`:root`); nested providers default to local (subtree only) |
| `validate` | `boolean` | Console warnings for invalid config (default on outside production) |

Only one top-level provider. Nest a provider only to re-theme a section (e.g. a dark sidebar).

### 3.3 Runtime access

```tsx
"use client";
import { useTheme } from "@itsrighttime/irt-ui/theme";

const { theme, mode, resolvedMode, setMode } = useTheme();
setMode(resolvedMode === "dark" ? "light" : "dark"); // dark-mode toggle
theme.colors.primary; // resolved values (for charts/canvas). Prefer CSS vars for styling.
```

### 3.4 Tokens → CSS variables (use these in your own CSS)

| Theme key | CSS variables |
|---|---|
| `colors.*` | `--irt-color-primary`, `-on-primary`, `-primary-hover`, `-primary-active`, `-primary-subtle`, `-secondary`, `-on-secondary`, `-accent`, `-on-accent`, `-background`, `-surface`, `-surface-muted`, `-surface-raised`, `-text`, `-text-muted`, `-text-subtle`, `-text-inverse`, `-border`, `-border-muted`, `-border-strong` (hovered control borders), `-success`/`-on-success`, `-warning`/`-on-warning`, `-danger`/`-on-danger`, `-info`/`-on-info`, `-disabled`/`-on-disabled`, `-hover`, `-active`, `-focus`, `-overlay`, `-tooltip-background`, `-tooltip-text`, `-white`, `-black`, `-gray1`…`-gray5` (all prefixed `--irt-color`) |
| `typography` | `--irt-font-family-base/heading/mono`, `--irt-font-size-base`, `--irt-font-size-xs/sm/md/lg/xl/2xl`, `--irt-font-weight-regular/medium/semibold/bold`, `--irt-line-height-tight/normal/relaxed`, `--irt-letter-spacing-tight/normal/wide`, `--irt-heading-h1-font-size` (…h2, h3, `-font-weight`, `-line-height`) |
| `spacing` | `--irt-space-none/xs/sm/md/lg/xl/2xl` (4/8/16/24/32/48 px by default) |
| `radius` | `--irt-radius-none/sm/md/lg/full` |
| `borders` | `--irt-border-width-thin/thick`, `--irt-border-style` |
| `shadows` | `--irt-shadow-none/sm/md/lg/focus` |
| `motion` | `--irt-duration-fast/normal/slow`, `--irt-easing-standard/emphasized/linear` |
| `opacity` | `--irt-opacity-disabled/muted/overlay` |
| `effects` | `--irt-backdrop-blur` |
| `layout` | `--irt-container-sm…xl`, `--irt-breakpoint-sm…xl`, `--irt-grid-gap-sm/md/lg`, `--irt-z-base/dropdown/sticky/drawer/modal/popover/toast/tooltip`, `--irt-control-height-small/medium/large`, `--irt-control-width`, `--irt-workspace-bar-size/sidebar-size/tab-padding` |
| `components.*` | JS-only defaults (button variant/size/radius, input variant/size/radius/width, tooltip delay/maxWidth, alert duration, icon size/strokeWidth) — no CSS vars |

`on*` colours are for text/icons on the matching fill. Helper: `themeVar("colors.textMuted")` → `"var(--irt-color-text-muted)"`, `themeVar("spacing.md", "16px")` → with fallback.

```css
/* app CSS — good */
.card { background: var(--irt-color-surface); border: var(--irt-border-width-thin) solid var(--irt-color-border-muted);
        border-radius: var(--irt-radius-lg); padding: var(--irt-space-md); box-shadow: var(--irt-shadow-sm); }
```

Never style library internals by their generated class names (`irt-Button-module__…`); they change.
Variables named `--irt-c-*` are private.

---

## 4. Components

Signatures list the useful props; every prop is typed in the package. `?` = optional.

### 4.1 Actions

**`Button`** — polymorphic button.
```tsx
<Button onClick={save}>Save</Button>
<Button variant="secondary" size="small" iconLeft="plus">Add row</Button>
<Button variant="destructive" iconLeft="trash" loading={deleting}>Delete</Button>
<Button iconOnly iconLeft="settings" ariaLabel="Settings" variant="ghost" />
<Button as="a" href="/docs" iconRight="externalLink">Docs</Button>      // link, typed props of <a>
<Button as={Link} href="/users" variant="tertiary">Users</Button>         // router link
<Button type="submit" block>Sign in</Button>                              // full width
```
Props: `variant?: "primary" | "secondary" | "tertiary" | "ghost" | "destructive"`, `size?`, `radius?`,
`iconLeft?`, `iconRight?: IconLike`, `iconOnly?`, `block?`, `loading?` (spinner + blocks clicks),
`disabled?`, `tooltip?: string`, `ariaLabel?`, `color?`, `width?`, `height?`, `as?`, plus all native
attributes of the rendered element. Renders `type="button"` by default — pass `type="submit"` in forms.

**`IconButton`** — compact icon button; `label` is the accessible name and tooltip.
```tsx
<IconButton icon="close" label="Close" onClick={onClose} />
<IconButton icon="bell" label="Notifications" size={1.4} isBorder hoverBackground color="var(--irt-color-secondary)" />
```
```tsx
<IconButton icon="bell" label="Notifications" variant="soft" />
<IconButton icon="edit" label="Draw" active color="var(--irt-color-primary)" />   // pressed tool (aria-pressed)
<IconButton icon="close" label="Close" color="var(--irt-color-text-muted)" />      // neutral toolbar icon
```
Props: `icon: IconLike | image-URL string`, `label?`, `onClick?`, `variant?: "ghost" | "soft" | "solid" | "outline" | "plain"` (default `ghost`: transparent with a tinted hover; `isBorder` = `outline`), `shape?: "rounded" | "circle" | "square"`, `active?` (sets `aria-pressed`), `size?: number` (multiplier of base font size, default 1), `color?` (default primary — use `var(--irt-color-text-muted)` for neutral toolbar icons), `hoverBackground?` (legacy filled hover), `disabled?`, `type?`, `className?` (on the `<button>`).

**`PlainButton`** — text/link-style button: `<PlainButton onClick={resend}>Resend code</PlainButton>`.
Props: `children` (or legacy `text`), `iconLeft?`, `iconRight?`, `color?` (default primary), `fontSize?` (rem), `fontWeight?`, `isUnderline?`, `ariaLabel?`, `disabled?`.

### 4.2 Text inputs

**`TextInput`** — extends native `<input>` attributes (except `type`, `size`, `color`, `width`, `height`).
```tsx
const [email, setEmail] = useState("");
<TextInput label="Email" textType="email" iconLeft="mail" value={email} setResult={setEmail}
           helperText="We never share it" error={errors.email} required width="100%" />
```
Props: `label?` (acts as placeholder while empty, floats above once `value` is non-empty),
`placeholder?` (used when there is no `label`), `value?`, `setResult?: (v: string) => void`
(your `onChange` also still fires), `textType?: "text" | "password" | "number" | "email" | "tel" | "url" | "search"`,
`variant?: "outline" | "filled" | "ghost" | "underline"`, `size?`, `radius?`, `iconLeft?`, `iconRight?`,
`helperText?`, `error?` (marks invalid + announces), `loading?`, `disabled?`, `block?`, `width?` (default theme `300px`), `height?`.
Heights follow `theme.layout.control.height[size]` (32/40/48 px) — the same as `Button`, so mixed rows line up.
For the floating label to work, control the value (`value` + `setResult`).

**Presets** (same props as TextInput, type fixed): `EmailInput`, `PasswordInput` (show/hide toggle),
`MobileInput` (keeps only digits and `+`), `NumberInput` (value is still a string — parse it),
`UrlInput` (validates; `faviconResolver={googleFaviconResolver}` opt-in favicon; `invalidMessage?`).

**`TextArea`** — auto-growing; **emits on blur**.
```tsx
<TextArea label="Description" value={desc} setResult={setDesc} maxLength={500} showCharacterCount showWordCount width="100%" />
```
Props: `setResult` (required, on blur), `onValueChange?` (every keystroke), `label?`, `ariaLabel?`, `value?`, `placeholder?`, `minLength?`, `maxLength?`,
`minRows?` (3), `maxTextAreaHeight?` (px, 200), `resizable?`, `helperText?`, `error?`, `showCharacterCount?`, `showWordCount?`, `setIsFieldValid?`, `backendError?`, `required?`, `disabled?`, `width?`, `color?`, `className?`.

**`JsonField`** — JSON editor with "Validate & Save"; `setResult` gets pretty JSON.
`<JsonField label="Config" value={json} setResult={setJson} setIsFieldValid={setValid} indent={2} saveLabel="Save" />`
Invalid JSON shows the parser's message; `hideOnSave` replaces the editor with a "saved" row that has an Edit button.

**`AddressInput`** — composite address; enable fields with flags.
`<AddressInput isHouse isStreet isCity isState isPostal isCountry value={addr} setResult={setAddr} width="100%" />`
Value type `AddressValue = { house?, street?, city?, state?, postal?, country?, addressLine?, landmark? }` (flags: `isHouse`, `isStreet`, `isLandmark`, `isCity`, `isState`, `isPostal`, `isCountry`, `isAddressLine`).
Extras: `columns?: 1 | 2` (city/state and postal/country side by side), `legend?` (renders a `<fieldset>` legend), `labels?: { postal: "ZIP" }`, `requiredFields?: ["city"]`, `errors?: { postal: "Invalid" }`, `disabled?`. Fields get proper `autoComplete` tokens.

**`OtpField`** — one-time code, paste supported.
```tsx
<OtpField length={6} verify={(code) => api.verifyOtp(userId, code)} setResult={(code) => code && onVerified(code)} setError={setOtpError} />
```
`verify?: (code) => boolean | { success: boolean; message?: string } | Promise<…>`; without `verify` the
completed code is emitted directly. `setResult(null)` on failed verification; the field clears after `resetDelay` (3000 ms).
Other: `isNumeric?` (true), `onComplete?`, `invalidMessage?`, `disabled?`, `width?`, `color?`.

**`SearchBox`** — autocomplete over a static list. Uncontrolled; emits the chosen `code`.
```tsx
<SearchBox suggestions={users.map((u) => ({ code: u.id, name: u.name }))} setResult={(id) => openUser(id)} minChars={2} placeholder="Find user…" />
```
Props: `suggestions: { code: string | number; name: string }[]`, `setResult`, `minChars?` (3), `placeholder?`, `ariaLabel?`, `width?`, `color?`,
`variant?: "outline" | "underline"` (default outline), `clearable?` (true), `emptyText?`, `defaultQuery?`, `renderSuggestion?(s, query)`, `onQueryChange?(query)`.
Matches are highlighted. For server-side search, update `suggestions` from `onQueryChange`.

### 4.3 Selection

**`Dropdown`** — searchable select. **The value is always `string[]` of option values.** Options are strings or
`DropdownOption = { value: string; label?: string; description?: string; icon?: IconLike; disabled?: boolean }`.
```tsx
<Dropdown options={["Admin", "Editor", "Viewer"]} placeholder="Role" value={roles} setResult={setRoles} multiple width="100%" />
<SingleDropdown options={countries} placeholder="Country" value={country} setResult={setCountry} />   // value: string
<MultipleDropdown options={tags} placeholder="Tags" value={tags} setResult={setTags} addNew setAddedOptions={setTagOptions} />
```
```tsx
<Dropdown placeholder="Assignee" options={users.map((u) => ({ value: u.id, label: u.name, description: u.email, icon: "user" }))}
          value={assignee ? [assignee] : []} setResult={([id]) => setAssignee(id ?? null)} error={errors.assignee} />
```
Props: `options`, `value?`, `setResult`, `multiple?`, `placeholder?` ("Select..."), `label?` (floating label once selected; defaults to placeholder),
`floatingLabel?` (true; `false` when you render your own label), `helperText?`, `error?`, `size?`, `block?`, `searchable?` (true), `searchPlaceholder?`, `emptyText?`,
`maxMenuHeight?` (300), `addNew?` + `setAddedOptions?`, `required?`, `disabled?`, `width?`, `color?`, `ariaLabel?`, `onOpenChange?`, `id?`, `className?`.
Multi-select shows a count chip + labels; single-select shows the label. Keyboard: Enter/↓ open, ↑/↓/Home/End, Enter select, Escape close, Backspace clears.

**`CheckboxGroup`** / **`RadioGroup`** — native inputs, keyboard and form friendly.
```tsx
<CheckboxGroup label="Notify by" options={[{ value: "email", label: "Email", help: "Daily digest" }, "SMS"]} value={channels} setResult={setChannels} layout="horizontal" />
<RadioGroup label="Plan" options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro", disabled: true }]} value={plan} setResult={(v) => v && setPlan(v)} />
```
Option = `string | { value: string | number; label: string; help?: string; disabled?: boolean }`.
CheckboxGroup `setResult(values: (string|number)[])`; RadioGroup `setResult(value: string | number | null)`.
Props: `label?`, `layout?: "vertical" | "horizontal"`, `variant?: "default" | "card"` (bordered selectable cards), `helperText?`, `error?`, `required?`, `disabled?`, `width?` (300px), `color?`, `name?`, `id?`, `className?`, `customStyles?: { group?, item?, label? }`.

**`Switch`** — `<Switch label="Two-factor auth" value={on} setResult={setOn} width="auto" />`
Props: `value?`, `setResult`, `label?` (or `ariaLabel?`), `description?`, `size?` (small/medium/large), `labelPosition?: "start" | "end"`, `spread?` (label and switch at opposite ends — settings rows), `disabled?`, `required?`, `color?`, `width?` (300px), `className?`, `customStyles?: { container?, label? }`.
Settings row: `<Switch label="Product updates" description="Monthly email" spread width="100%" value={on} setResult={setOn} />`.

**`Slider`** — `<Slider label="Volume" value={v} setResult={setV} min={0} max={100} step={5} showValueSide="right" />`
Props: `min?` (0), `max?` (100), `step?` (1), `showRange?` (true), `showButtons?` (true; − / + step buttons), `showValueSide?: "none" | "left" | "right" | "top" | "bottom"`, `formatValue?: (v) => string` (value, range labels and `aria-valuetext`), `helperText?`, `precision?` (10 → 0.1 rounding; use 100 for 0.01 steps), `disabled?`, `width?`, `color?`, `id?`, `className?`.

**`Stepper`** — `<Stepper label="Guests" value={n} setResult={setN} min={1} max={10} step={1} />` (default `step` is **5**).
Segmented `[− | value | +]` control; the value is a `spinbutton` (↑/↓, PageUp/PageDown ×10, Home/End). Extras: `size?`, `align?: "center" | "start"`, `formatValue?`, `helperText?`, `className?`.

### 4.4 Date & time

**`Calendar`** (inline) and pickers (input + popup): `DatePicker`, `DayPicker`, `MonthPicker`, `MonthYearPicker`, `YearPicker`.
```tsx
<DatePicker label="Due date" placeholder="dd-mm-yyyy" monthBase={1} value={due} setResult={(v) => setDue(String(v))}
            restrictionStartDate="01-01-2026" restrictionEndDate="31-12-2026" width="100%" />
<Calendar mode="month-year" monthBase={1} setResult={setPeriod} />
```
Emitted values (with `monthBase={1}`): date → `"dd-mm-yyyy"`, day → `"dd"`, month → `number` (1–12),
month-year → `"m-yyyy"`, year → `number`. Restrictions are `"dd-mm-yyyy"` strings (1-based month).
Convert to `Date` with `convertStrDate2Date("05-10-2026")` (exported).
Other props: `value?` (highlights the selection; today always has a ring — `highlightToday?`), `firstDayOfWeek?: 0 | 1` (Monday = 1), `locale?` ("en-US"), `weekdayLabels?`, `isSmall?`, `color?`, `className?`.
Pickers: `label?`, `placeholder?`, `value?`, `formatValue?: (v) => string` (e.g. show "5 Oct 2026"), `clearable?` (× button and Backspace emit `""`), `helperText?`, `error?`, `compact?` (small popup), `firstDayOfWeek?`, `variant?: "full" | "underline"`, `required?`, `disabled?`, `width?`, `height?`.
The popup is a portal popover that flips above the field when needed; arrow keys move between days.

**`TimePicker`** — 12-hour.
`<TimePicker label="Start" value={time} setResult={setTime} minTime="08:00 AM" maxTime="06:00 PM" minuteStep={15} />`
Value format `"hh:mm AM|PM"`; emits only complete, in-range times. `convertToMinutes("01:30 PM")` → 810.
Single field with hour / minute / AM-PM segments (↑/↓ on a focused segment steps it). Extras: `helperText?`, `error?`, `size?`, `radius?`, `width?`, `hourStep?`.

### 4.5 Overlays

**`Modal`**
```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Invite member" description="They get an email link." size="sm"
       footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={send}>Send invite</Button></>}>
  <InviteForm />
</Modal>
```
Props: `isOpen`, `onClose`, `children`, `title?` (also labels the dialog), `description?`, `footer?` (right-aligned actions), `size?: "auto" | "sm" | "md" | "lg" | "xl" | "full"` (default `auto`), `width?`,
`ariaLabel?` | `ariaLabelledBy?` (when there is no `title`), `closeOnOverlayClick?` (true), `closeOnEscape?` (true), `showCloseButton?` (true), `lockScroll?` (true), `className?` (overlay), `contentClassName?` (panel), `style?`.
Portal + focus trap + scroll lock + Escape built in; a drag that starts inside the panel never closes it. Render it unconditionally and toggle `isOpen`.

**`Dialog`** — modal with icon tabs.
```tsx
<Dialog isOpen={open} onClose={close} title="Settings" activeKey={tab} onActiveKeyChange={setTab}
        items={[{ key: "profile", icon: "user", component: <Profile /> }, { key: "security", icon: "lock", label: "Security", component: <Security /> }]} />
```
Tabs are internal unless you pass `activeKey`; sync to the URL yourself if needed (`?tab=`). Tab label defaults to the key in sentence case.
Extras: `showLabels?` (text next to tab icons), `width?`, `footer?`, `closeOnOverlayClick?`, `closeOnEscape?`, `lockScroll?`. ←/→/Home/End switch tabs; items accept `disabled`.

**`Popover`** / **`DynamicPopover`** — low-level anchored portal panel (default width = anchor width).
```tsx
const anchorRef = useRef<HTMLDivElement>(null);
<div ref={anchorRef}><Button onClick={() => setOpen((o) => !o)}>Filters</Button></div>
<Popover anchorRef={anchorRef} isOpen={open} onClose={() => setOpen(false)} style={{ width: "auto" }}>…</Popover>
<DynamicPopover anchorRef={anchorRef} isOpen={open} onClose={close}>{({ placement }) => <Panel up={placement === "top"} />}</DynamicPopover>
```
Props: `anchorRef`, `isOpen`, `onClose`, `offset?`, `flip?` (Popover), `closeOnOutsideClick?`, `closeOnEscape?`, `role?`, `className?`, `style?`.

**`DropdownSimple`** — action menu (`role="menu"`). Positioned absolutely: put it inside a `position: relative` wrapper with the trigger (or inside a `Popover`).
```tsx
<div style={{ position: "relative", display: "inline-block" }}>
  <Button iconRight="chevronDown" onClick={() => setOpen((o) => !o)}>Actions</Button>
  <DropdownSimple isOpen={open} ariaLabel="Actions" onSelect={(key) => { run(key); setOpen(false); }}
    items={[{ key: "edit", value: "Edit", description: "⌘E" }, { key: "share", value: "Share", box: ["new"] }, { key: "archive", value: "Archive", disabled: true }, "Delete"]} />
</div>
```
Items: `string | { key; value; description?; box?: string[]; icon?: IconLike; danger?: boolean; route?; disabled? }`. Close it yourself after `onSelect`; pass `onClose` so Escape/Tab close it too.

**`Tooltip`** — `<Tooltip content="Copy link" delay={300}><Button iconLeft="copy">Copy</Button></Tooltip>`
Child must be a single element that accepts a ref. Shows on hover after `delay` (theme default) and on keyboard focus (not on programmatic focus). Props: `content`, `delay?`, `width?` (max width), `color?`, `backgroundColor?`. Simple cases: use `Button`'s `tooltip` prop instead.

### 4.6 Feedback

**Alerts (toasts)**
```tsx
const [alerts, setAlerts] = useState<AlertItem[]>([]);
const notify = (message: string, type: AlertType = "success") =>
  setAlerts((a) => [...a, { id: crypto.randomUUID(), message, type }]);
<AlertContainer alertContainer={alerts} removeAlert={(id) => setAlerts((a) => a.filter((x) => x.id !== id))} />
```
`AlertType = "success" | "error" | "info" | "warning"`; `AlertItem.duration?` ms (theme default 10 000, `0` = sticky).
Mount one `AlertContainer` near the app root (`position: fixed`; `position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"`) and expose `notify` via your own context. `AlertItem.title?` adds a heading.
Inline alert: `<Alert type="warning" title="Trial ends soon" message="Upgrade to keep your data." action={<Button size="small">Upgrade</Button>} duration={0} onDismiss={hide} />`.
Alert props: `type`, `message: ReactNode`, `title?`, `icon?` (default type icon; `false` hides; or any icon), `action?`, `dismissible?` (true), `duration?` (ms; pauses while hovered/focused), `onDismiss`, `className?`.

**`Badge`** — status label / count (server-safe):
`<Badge tone="success" dot>Active</Badge>`, `<Badge tone="danger" variant="solid" size="small">3</Badge>`.
Props: `tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info"`, `variant?: "soft" | "solid" | "outline"`, `size?: "small" | "medium"`, `icon?`, `dot?`, `color?` (overrides tone).

**`ErrorMsg`** — inline error text (server-safe): `<ErrorMsg message="Required" />` (`bold?`, `fontSize?`, `textAlign?`, `padding?`).

**`Loading`**
```tsx
<div style={{ position: "relative", minHeight: 200 }}>
  <Loading type="BounceLoader" display="center" position="absolute" showText text="Loading users" />
</div>
```
`type?: "CubesLoader" | "FoldingLoader" | "BounceLoader" | "PulseLoader" | "LoadingChat"`; `display?: "top" | "center"`;
`position?`, `windowHeight?`, `windowWidth?` (100%), `color?`. Bare spinners: `CubesLoader`, `FoldingLoader`, `BounceLoader`, `PulseLoader`, `LoadingChat`.
Full-screen route fallback: `<SecondaryLoading />`. Skeleton-like card state: `<LoadingBorder loading={isLoading}><Card /></LoadingBorder>`.

**`IconError`** — empty/failed placeholder: `<IconError icon="imageOff" message="No image" size={2} />`.

**`ErrorPage`** — HTTP error view: `<ErrorPage statusCode={404} handleNavigate="/" onNavigate={router.push} />`
(`handleNavigate` may also be a click handler; `navigateTo?` label, `errorMsg?`, `statusDetail?`, `title?`, `description?`, `actions?` (e.g. a retry Button), `color?`).
Inside an app shell that already has `<main>`, use `as="section"` and `fullHeight={false}`.

### 4.7 Data

**`Table<T>`**
```tsx
const columns: TableColumn<User>[] = [
  { key: "name", title: "Name", sortable: true },
  { key: "email", title: "Email" },
  { key: "status", title: "Status", sortable: true, render: (u) => <StatusBadge status={u.status} /> },
  { key: "city", title: "City", render: (u) => u.address.city },   // computed column
];
<Table<User> data={users} columns={columns} rowKey={(u) => u.id} pageSize={20}
  visibleColumns={["name", "email", "status"]}
  rowActions={[{ label: "Edit", icon: "edit", iconOnly: true, variant: "ghost", onClick: (u) => edit(u) },
              { label: "Delete", icon: "trash", variant: "danger", onClick: remove, disabled: (u) => u.role === "owner" }]}
  title="Users" toolbar={<Button size="small" iconLeft="plus">Invite</Button>} density="compact" striped
  controls={{ search: true, columnSelector: true, pagination: true }}
  showRowDetails={false} onCellClick={(u) => open(u)} caption="Users" emptyText="No users yet" />
```
- `TableColumn<T>`: `key` (property or unique id), `title`, `sortable?`, `render?`, `compare?(a, b)`, `visible?`, `align?: "left" | "center" | "right"`, `width?`.
- `TableAction<T>`: `label`, `onClick(row, e)`, `icon?`, `iconOnly?` (label becomes tooltip), `variant?: "secondary" | "ghost" | "danger"`, `hidden?(row)`, `disabled?(row)`.
- Layout props: `title?`, `toolbar?` (extra toolbar content), `searchPlaceholder?`, `density?: "comfortable" | "compact"`, `striped?`, `stickyHeader?` + `maxHeight?`, `loading?` (overlay), `className?`. The footer shows "1–20 of 134" and the pager.
- Status cells: `render: (u) => <Badge tone={u.active ? "success" : "danger"} dot>{u.status}</Badge>`.
- Search, sort and pagination are **client-side** over `data` (search matches raw values of visible columns).
- `showRowDetails` (default **true**) opens a record drawer on cell click — set `false` when cells are links/actions.
- Always pass `rowKey`.
- Standalone pager: `<Pagination currentPage={p} totalPages={n} onPageChange={setP} />` (for server pagination).

**`DataTableWithActions<T>`** — table whose row action opens a tabbed `Dialog`:
`<DataTableWithActions data={rows} columns={cols} visibleColumns={["name"]} actionLabel="Manage" dialogTitle="Manage" dialogItems={[{ key: "security", icon: "lock", component: <Security /> }]} onDialogOpenChange={(open, row) => setSelected(row ?? null)} />`
Extras: `dialogShowLabels?`, `tableProps?` (any other Table prop: `title`, `toolbar`, `density`, extra `rowActions`, …).

**`DataSnapshotViewer`** — drawer listing every field of a record (nested keys flattened):
`<DataSnapshotViewer data={selected} title="Account" onClose={() => setSelected(null)} />` (`null` = closed).

### 4.8 Media uploads

| Component | Value | Key props |
|---|---|---|
| `FileUpload` | `File[]` | `value?`, `setResult`, `allowedTypes?` (MIME list, empty = any), `maxSizeMb?`, `maxFiles?`, `allowPreview?`, `label?`, `width?`, `height?` (drop-zone min height) |
| `ImageUpload` | `File \| null` | `requireSquare?` (**default true** — pass `false` for normal images), `allowedTypes?` (jpeg/png/gif), `maxSizeMb?` (5), `value?` (URL or File), `fit?: "cover" \| "contain"` |
| `ImagePreview` | — | `image: File \| string \| null`, `width?`, `height?`, `radius?`, `alt?`, `fit?`, `emptyText?` |
| `VideoUpload` | `File \| null` | `preview?` (show player), `allowedTypes?` (mp4/webm), `maxSizeMb?` (50) |
| `VideoPlayer` | — | `videoFile`, `onRemove?`, `onReupload?`, `autoPlay?`, `muted?`, `emptyText?` |
| `AudioUpload` | `File \| null` | `allowedTypes?` (mpeg/wav), `maxSizeMb?` (10) |
| `AudioPlayer` | — | `audioSrc: string`, `title?`, `onRemove?`, `onReupload?` |

All uploads support drag & drop, `setIsFieldValid?`, `backendError?`, `required?`, `disabled?`, `helperText?`, `dropzoneText?`, `hint?` (defaults to a summary of your limits, e.g. "PDF · up to 5 MB · max 3 files"), `className?`. They never upload — send the `File`s yourself.
Helpers: `formatFileSize(bytes)`, `getFileTypeLabel(mime)`.

### 4.9 Content

**`MarkdownRenderer`** (`@itsrighttime/irt-ui/markdown`) — GFM, raw HTML is not rendered, lazy theme-aware syntax highlighting (light/dark), code blocks with a language label and Copy button, links open in new tabs.
`<MarkdownRenderer content={md} components={{ img: (p) => <img {...p} loading="lazy" /> }} />`

### 4.10 Tabs

**`Tabs`** — content tabs or a segmented control.
```tsx
<Tabs ariaLabel="Project" items={[
  { key: "overview", label: "Overview", icon: "home", content: <Overview /> },
  { key: "issues", label: "Issues", badge: 8, content: <Issues /> },
  { key: "settings", label: "Settings", disabled: true, content: null },
]} />
<Tabs variant="enclosed" size="small" ariaLabel="Range" value={range} onChange={setRange}
      items={[{ key: "day", label: "Day" }, { key: "week", label: "Week" }]} />   // no `content` → segmented control
```
Props: `items: { key; label; content?; icon?; badge?; disabled? }[]`, `value?` / `defaultValue?` / `onChange?(key)`, `variant?: "underline" | "pills" | "enclosed"`, `size?: "small" | "medium"`, `fitted?`, `keepMounted?`, `ariaLabel?`, `className?`, `panelClassName?`. Arrow keys / Home / End move between enabled tabs.

### 4.11 Layout — `Workspace` app shell (config reference)

The whole app shell is driven by one plain object, `WorkspaceConfig`. Build it from state, permissions or
server data; the layout re-renders when it changes (wrap it in `useMemo`). The playground has an interactive
version of this reference at **Layout › Workspace config** (`#/guides/workspace`).

```ts
import { Workspace, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";
```

#### Slots

| Slot | Position | Value | Allowed tabs |
|---|---|---|---|
| `topPrimary` | top edge, full width | `BarTabs` | all |
| `topSecondary` | above the content, between the sidebars | `BarTabs` | all |
| `bottomSecondary` | below the content, between the sidebars | `BarTabs` | all |
| `bottomPrimary` | bottom edge, full width | `BarTabs` | all |
| `leftPrimary` / `leftSecondary` | outer / inner left column | `BarTabs` | `icon`, icon-trigger `dropdown`, `custom` |
| `rightSecondary` / `rightPrimary` | inner / outer right column | `BarTabs` | `icon`, icon-trigger `dropdown`, `custom` |
| `leftSidebar` / `rightSidebar` | beside the content | `SidebarItem[]` | `label` items and `group`s |

All slots are optional; an omitted or empty slot takes no space. Names are also exported as `WORKSPACE_SLOTS.*`.
`BarTabs = { start?: TabConfig[]; center?: TabConfig[]; end?: TabConfig[] }` — left/middle/right (horizontal) or top/middle/bottom (vertical).

#### Tab types (`TabConfig`)

Every tab has `id: string` (unique across the config), `type`, and optional `route` (navigate on activation + active highlighting).

| `type` | Fields | Where |
|---|---|---|
| `"text"` | `text` (truncated ~18 ch), `onClick?`, `disabled?` | horizontal bars |
| `"icon"` | `icon: IconName`, `label?` (accessible name + tooltip — always set), `onClick?`, `disabled?` | any bar |
| `"label"` | `text`, `leftIcons?` / `rightIcons?: TabIconItem[]`, `tokens?: TabToken[]`, `background?`, `border?`, `onClick?` | horizontal bars, sidebars |
| `"dropdown"` | `trigger: { type: "text" \| "icon"; text?; icon?; label? }`, `items: DropdownItem[]`, `onSelect?(key)` | any bar (vertical: icon trigger only) |
| `"custom"` | `render: () => ReactNode` | any bar |

- `TabIconItem = { icon; label?; color?; onClick?; disabled?; clickable? }` — with `onClick` the icon is its own button (does not activate the item).
- `TabToken = { text; color?; background? }` — badges/counts.
- `DropdownItem = string | { key; value; route?; icon?; description?; box?: string[]; danger?; disabled? }` — an item with `route` navigates; otherwise `onAction` gets `{ id: <tab id>, key: <item key> }`.

#### Sidebar items (`SidebarItem`)

- Label: `{ id, type: "label", text, route?, leftIcons?, rightIcons?, tokens?, background?, border?, onClick? }` (`onClick` runs when there is no `route`).
- Group: `{ id, type: "group", title?, icon?, children: SidebarItem[], collapsible?: boolean /* true */, defaultOpen?: boolean /* false */ }`. Groups nest to any depth; a collapsed group containing the active route is highlighted.

#### Full example

```tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { Workspace, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";

const config: WorkspaceConfig = {
  topPrimary: {
    start: [{ id: "brand", type: "custom", render: () => <Logo /> }],
    center: [
      { id: "dashboard", type: "text", text: "Dashboard", route: "/app" },
      { id: "reports", type: "text", text: "Reports", route: "/app/reports" },
    ],
    end: [
      { id: "notifications", type: "icon", icon: "bell", label: "Notifications" },
      { id: "account", type: "dropdown", trigger: { type: "icon", icon: "userCircle", label: "Account" },
        items: [{ key: "profile", value: "Profile", icon: "user", route: "/app/profile" },
                { key: "logout", value: "Log out", icon: "logout", danger: true }] },
    ],
  },
  leftPrimary: {
    start: [{ id: "home", type: "icon", icon: "home", label: "Home", route: "/app" }],
    end: [{ id: "settings", type: "icon", icon: "settings", label: "Settings", route: "/app/settings" }],
  },
  leftSidebar: [
    { id: "crm", type: "group", title: "CRM", icon: "target", defaultOpen: true, children: [
      { id: "leads", type: "label", text: "Leads", route: "/app/leads", leftIcons: [{ icon: "inbox" }], tokens: [{ text: "12" }] },
      { id: "contacts", type: "label", text: "Contacts", route: "/app/contacts", leftIcons: [{ icon: "users" }] },
    ] },
  ],
};

export function AppShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const router = useRouter();
  return (
    <Workspace config={config} currentPath={usePathname()} onNavigate={(route) => router.push(route)}
      onAction={({ id, key }) => { if (key === "logout") signOut(); if (id === "notifications") openInbox(); }}
      topPrimaryStart={<strong>{userName}</strong>}>
      {children}
    </Workspace>
  );
}
```

#### Routing & actions

- The Workspace never navigates by itself: `onNavigate(route, payload)` fires for tabs/items/dropdown items with a `route`; `onAction(payload)` fires for every activation (`payload = { id, route?, key? }`).
- Highlighting uses `currentPath` (`usePathname()`, `useLocation().pathname`). Matching (`matchRoute`, exported):
  absolute routes (`"/app/leads"`) match by path-segment prefix (`/app/leads/42` keeps Leads active); a route that is only the base (`"/app"`) matches exactly;
  relative routes (`"leads"`) match after `basePath` (default: first path segment); query/hash are ignored. Replace the matcher with `isRouteActive(route)`.
- react-router: `currentPath={useLocation().pathname}`, `onNavigate={useNavigate()}`, children `<Outlet />`.
- Inside `custom` tabs or pages: `const { currentPath, isRouteActive } = useWorkspaceRoute()`.

#### Context-aware visibility

```ts
visibility={{
  alwaysVisible: ["brand", "crm", "hr", "settings"],
  map: { crm: ["crm-leads", "crm-deals"], hr: ["hr-people", "hr-leave"] },  // activating "crm" reveals its ids
  initialTab: "crm",
}}
```
Activating any id that is a key of `map` makes it the active parent; only `alwaysVisible` + its mapped ids render (groups stay while a child is visible).
For permission-based menus use `filterWorkspace(config, new Set(allowedIds))` (or `filterSidebar(items, ids)`), or build the config conditionally.

#### Workspace props

`config` (required), `children`, `currentPath?`, `basePath?`, `isRouteActive?`, `onNavigate?`, `onAction?`, `topPrimaryStart?` (node prepended to `topPrimary.start`),
`visibility?`, `height?` (100vh), `width?` (100vw), `barSize?` / `sidebarWidth?` (any CSS length; defaults from `layout.workspace.*` tokens),
`leftSidebarOpen?` / `rightSidebarOpen?` (true) + `onSidebarOpenChange?(side, open)`, `overlayBreakpoint?` (px of the workspace's own width; below it open sidebars become drawers with a backdrop — Escape/backdrop click call `onSidebarOpenChange(side, false)`),
`skipLinkLabel?` ("Skip to content"; `false` disables), `contentClassName?` / `contentStyle?` (the scrollable `<main>`), `className?`, `style?`.

Mobile drawer pattern:
```tsx
const [navOpen, setNavOpen] = useState(true);
const config = useMemo<WorkspaceConfig>(() => ({
  topPrimary: { start: [{ id: "nav", type: "custom", render: () =>
    <IconButton icon={navOpen ? "close" : "menu"} label="Toggle navigation" onClick={() => setNavOpen((o) => !o)} /> }] },
  leftSidebar: sidebar,
}), [navOpen]);
<Workspace config={config} leftSidebarOpen={navOpen} onSidebarOpenChange={(_, open) => setNavOpen(open)} overlayBreakpoint={900} … />
```

#### Validation (throws on render)

- Vertical slots reject `text` and `label` tabs; a `dropdown` there must use `trigger.type: "icon"`. An invalid config throws `"Invalid Workspace Config"` (details logged).
- Check ahead of time: `validateWorkspaceConfig(config)` → `{ slot, tabId, message }[]`.
- Keep every `id` unique (actions, visibility and React keys depend on it). Tab arrays need stable `id`s, not indexes.

#### Exports (`@itsrighttime/irt-ui/layout`)

Types `WorkspaceConfig`, `BarTabs`, `TabConfig` (`TextTab | IconTab | LabelTab | DropdownTab | CustomTab`), `SidebarItem`, `SidebarGroup`, `SidebarTab`, `TabIconItem`, `TabToken`, `TabActionPayload`, `WorkspaceVisibility`;
constants `WORKSPACE_SLOTS`, `TAB_TYPE`, `TAB_ORIENTATION`; functions `matchRoute`, `validateWorkspaceConfig`, `filterWorkspace`, `filterSidebar`;
hooks `useWorkspace(config, visibility?)` (visibility engine for custom shells), `useWorkspaceRoute()`;
components `TabBar` (`<TabBar config={{ start, center, end, orientation? }} onAction isRouteActive />`) and `Sidebar` (`<Sidebar config={items} position="leftSidebar" onAction />`) for standalone use.

#### Agent rules for Workspace

- Render one Workspace in the root (client) layout; pages go in `children`. Do not nest Workspaces.
- Put only icon tabs (always with `label`) in vertical bars; use sidebars for text navigation.
- Derive dynamic parts (badges, user name, permissions, nav toggle) inside `useMemo` and pass the result as `config`.
- Never call the router from inside tab configs — set `route` and handle `onNavigate`; use `onAction` for non-route actions (logout, open panel).

---

## 5. Icons

```tsx
import { Icon, IconProvider, type IconName } from "@itsrighttime/irt-ui";
<Icon name="search" size={20} />                  // decorative (aria-hidden)
<Icon name="alertTriangle" label="Warning" color="var(--irt-color-warning)" strokeWidth={1.5} />
<Icon as={MyLogo} size={28} />                     // any component with SVG props
```
Available `IconName`s:
`activity alertCircle alertTriangle arrowUpDown bell calendar check checkboxOff checkboxOn checkCircle chevronDown chevronLeft chevronRight chevronUp clock clockAlert close closeCircle cloudUpload columns copy download edit externalLink eye eyeOff file fileText filter folder heart home image imageOff inbox info key link loader lock logout mail menu minus moon moreHorizontal music pause phone play plus radioOff radioOn refresh search settings share star sun target trash upload user userCircle users video videoOff volume volumeOff wifiOff`

- Unknown names are TypeScript errors. If an icon you need is missing, pass a node (`iconLeft={<MyIcon />}`) or register it app-wide with `IconProvider`; do not install another icon library just for one icon.
- Replace icons globally: `<IconProvider icons={{ close: BrandClose, search: BrandSearch }} strokeWidth={1.75}>…</IconProvider>` (custom icons receive `size`, `color`, `strokeWidth` and SVG props).
- Legacy names (`crossIcon`, `logoutIcon`, …) still resolve but are deprecated — always write the semantic name.

---

## 6. Hooks & utilities (exported)

| Export | Use |
|---|---|
| `useControllableState({ value, defaultValue, onChange })` | Controlled/uncontrolled state in your own components |
| `useSyncedState(value)` | Local state that re-syncs when a prop changes |
| `useClickOutside(refs, handler, enabled?)`, `useEscapeKey(handler, enabled?)` | Dismiss logic |
| `useFocusTrap(ref, active)` | Trap focus in custom dialogs |
| `useScrollLock(active)` | Prevent page scroll behind custom overlays (ref-counted) |
| `useIsMounted()` | Defer browser-only/portal markup until after hydration |
| `useSmartPosition(ref, isOpen)` | `{ vertical, horizontal, ready }` viewport flipping |
| `cssVars({ "--x": v }, style?)` | Typed CSS-variable style objects (undefined `--irt-c-*` values reset to `initial`) |
| `cx(...classes)` | Class name join |
| `mergeRefs(...refs)`, `fromKebabCase(s, format?)`, `canUseDOM` | Misc |
| `themeVar(path, fallback?)`, `resolveTheme(config, mode)`, `validateThemeConfig(config)` | Theme helpers |

---

## 7. React & Next.js rules

- **Next.js App Router:** put `import "@itsrighttime/irt-ui/styles.css"` and `<ThemeProvider>` in `app/layout.tsx`.
  Server components may render library components but **cannot pass functions** to them. Wrap interactive
  usage (anything with `setResult`, `onClick`, state) in your own `"use client"` component.
- Server-safe (no client JS needed): `ErrorMsg`, `IconError`, `LoadingBorder`, `CubesLoader`, `FoldingLoader`,
  `BounceLoader`, `PulseLoader`, `SecondaryLoading`, `PlainButton` (without handlers), `ErrorPage` with a URL `handleNavigate` and no `onNavigate`, `TabText`.
  Everything else is a client component.
- No `window`/`document` access is needed for any library component; portals mount after hydration.
- Do not wrap library components in `dynamic(..., { ssr: false })`; they SSR correctly.
- Vite/CRA React: import the stylesheet in `main.tsx`; nothing else special.

---

## 8. Recipes

**Form with validation**
```tsx
"use client";
export function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", role: "", terms: false });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const set = <K extends keyof typeof form>(k: K) => (v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name) next.name = "Name is required";
    if (!/^\S+@\S+$/.test(form.email)) next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length === 0) void api.signup(form);
  };
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "var(--irt-space-md)", maxWidth: 420 }}>
      <TextInput label="Name" value={form.name} setResult={set("name")} error={errors.name} required width="100%" />
      <EmailInput label="Email" value={form.email} setResult={set("email")} error={errors.email} required width="100%" />
      <SingleDropdown options={["Admin", "Editor"]} placeholder="Role" value={form.role} setResult={set("role")} width="100%" />
      <Switch label="I accept the terms" value={form.terms} setResult={set("terms")} width="100%" />
      <Button type="submit" block disabled={!form.terms}>Create account</Button>
    </form>
  );
}
```

**Confirm destructive action**
```tsx
<Button variant="destructive" iconLeft="trash" onClick={() => setConfirm(true)}>Delete</Button>
<Modal isOpen={confirm} onClose={() => setConfirm(false)} ariaLabel="Confirm delete">
  <p>Delete this project? This cannot be undone.</p>
  <div style={{ display: "flex", gap: "var(--irt-space-sm)", justifyContent: "flex-end" }}>
    <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
    <Button variant="destructive" loading={busy} onClick={remove}>Delete</Button>
  </div>
</Modal>
```

**List page** — `Table` with `rowKey`, sortable columns, `rowActions`, `Loading` while fetching, `IconError` on error, `Pagination` for server-side pages.

**Dark-mode toggle** — `const { resolvedMode, setMode } = useTheme(); <IconButton icon={resolvedMode === "dark" ? "sun" : "moon"} label="Toggle theme" onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")} />`

**Section with its own theme** — `<ThemeProvider theme={{ colors: { primary: "#c2410c" } }} scope="local"><Promo /></ThemeProvider>`

---

## 9. Do / Don't checklist

| Do | Don't |
|---|---|
| `setResult={setValue}` with state | Expect an `onChange(event)` on `Dropdown`, `Switch`, `Slider`, … |
| `Dropdown options={string[]}` | Pass `{ label, value }` objects to `Dropdown` (that is `CheckboxGroup`/`RadioGroup`) |
| `monthBase={1}` on dates | Rely on 0-based months |
| `ImageUpload requireSquare={false}` for photos | Forget that square images are required by default |
| `Table rowKey={(r) => r.id}`, `showRowDetails={false}` when cells are interactive | Use index keys / get an unexpected drawer |
| `width="100%"` in forms | Leave every field at 300px |
| `var(--irt-color-*)`, `var(--irt-space-*)` in app CSS | Hardcode brand colours or override `irt-*-module__*` classes |
| Icon names (`iconLeft="plus"`) | Import lucide/heroicons directly in app code |
| `ariaLabel` on icon-only buttons, `ariaLabel` on `Modal` | Ship unlabeled controls |
| `"use client"` in components that pass handlers | Pass functions from server components |
| One `ThemeProvider` + one `AlertContainer` at the root | Multiple global providers |
