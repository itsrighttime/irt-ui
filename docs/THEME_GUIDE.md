# Theme Guide

The library is styled exclusively through **CSS custom properties prefixed
`--irt-`**. Values come from a typed `Theme` object; an application defines
its overrides once and every component follows them.

## 1. Defining a theme

```ts
// theme.ts
import type { ThemeConfig } from "@itsrighttime/irt-ui/theme";

export const theme = {
  colors: { primary: "#7c3aed", onPrimary: "#ffffff", secondary: "#475569" },
  typography: { fontFamily: { base: "Poppins, sans-serif" }, baseFontSize: "15px" },
  radius: { md: "10px" },
  components: {
    button: { variant: "secondary", size: "small" },
    tooltip: { delay: 500 },
  },
  dark: {
    colors: { primary: "#a78bfa", background: "#0b0b12" },
  },
} satisfies ThemeConfig;
```

- `ThemeConfig` is `DeepPartial<Theme> & { dark?: DeepPartial<Theme> }` — every key is optional and deep-merged over the defaults.
- **JSON** works unchanged: `import theme from "./theme.json"` (or fetch it) and pass it to the provider. Invalid keys/types are reported with `console.warn` in development (`validateThemeConfig()` is also exported).
- **YAML** is not parsed by the library; convert at build time (e.g. a YAML loader) and pass the resulting object.

```tsx
<ThemeProvider theme={theme} defaultMode="system">
  <App />
</ThemeProvider>
```

Without a provider every component still works: `styles.css` ships the
default light tokens on `:root` (and dark tokens under `[data-irt-mode="dark"]`).

## 2. Light / dark / system

| Prop | Meaning |
|---|---|
| `defaultMode="light" \| "dark" \| "system"` | initial mode (uncontrolled) |
| `mode` + `onModeChange` | controlled mode |
| `useTheme().setMode("dark")` | change at runtime |
| `useTheme().resolvedMode` | mode actually applied (`"system"` resolved; `"light"` during SSR) |

`"system"` is implemented with a `prefers-color-scheme` media query inside the
generated `<style>`, so server-rendered HTML is already correct — no flash
and no hydration mismatch. Dark values = defaults → library dark palette →
your config → your `dark` overrides.

## 3. Scoping and nesting

- The outermost provider writes variables to `:root` (`scope="global"`), so
  portals (modals, popovers, tooltips) inherit them.
- Nested providers default to `scope="local"`: variables are scoped to a
  wrapper (`display: contents`, no layout impact) and floating UI rendered
  inside portals into that wrapper so it keeps the local theme.
- Variables only use the `--irt-` prefix, so the library never collides with
  the host app's own variables; an app never receives another app's theme.

## 4. Precedence

From lowest to highest:

1. Default library theme (`defaultTheme`, `styles/tokens.css`)
2. Application theme (`<ThemeProvider theme>`; `dark` overrides in dark mode)
3. Component-level theme defaults (`theme.components.*`, e.g. default button variant)
4. Component props (`variant`, `size`, `color`, `width`, …)
5. Explicit local overrides (`className`, `style`)

## 5. Token reference

| Theme path | CSS variable(s) |
|---|---|
| `colors.primary`, `colors.onPrimary`, … | `--irt-color-primary`, `--irt-color-on-primary`, … |
| `typography.fontFamily.base/heading/mono` | `--irt-font-family-*` |
| `typography.baseFontSize` | `--irt-font-size-base` |
| `typography.fontSize.xs…2xl` | `--irt-font-size-*` |
| `typography.fontWeight.*`, `lineHeight.*`, `letterSpacing.*` | `--irt-font-weight-*`, `--irt-line-height-*`, `--irt-letter-spacing-*` |
| `typography.heading.h1.fontSize` | `--irt-heading-h1-font-size` |
| `spacing.none…2xl` | `--irt-space-*` |
| `radius.none/sm/md/lg/full` | `--irt-radius-*` |
| `borders.width.thin/thick`, `borders.style` | `--irt-border-width-*`, `--irt-border-style` |
| `shadows.*` | `--irt-shadow-*` |
| `motion.duration.*`, `motion.easing.*` | `--irt-duration-*`, `--irt-easing-*` |
| `opacity.*` | `--irt-opacity-*` |
| `effects.backdropBlur` | `--irt-backdrop-blur` |
| `layout.container.*`, `layout.breakpoints.*`, `layout.gridGap.*` | `--irt-container-*`, `--irt-breakpoint-*`, `--irt-grid-gap-*` |
| `layout.zIndex.*` | `--irt-z-dropdown`, `--irt-z-modal`, `--irt-z-popover`, `--irt-z-toast`, `--irt-z-tooltip`, … |
| `layout.control.height.*`, `layout.control.width` | `--irt-control-height-*`, `--irt-control-width` |
| `layout.workspace.*` | `--irt-workspace-bar-size`, `--irt-workspace-sidebar-size`, `--irt-workspace-tab-padding` |
| `components.*` | JS-only defaults (not emitted as CSS) |

Colour roles: `on*` colours are text/icon colours on top of the matching fill
(`onPrimary` on `primary`). `surface*` are component backgrounds,
`background` is the page. `gray1`–`gray5` go light → dark in light mode.

Helpers:

```ts
import { themeVar, useTheme } from "@itsrighttime/irt-ui/theme";

themeVar("colors.primary");          // "var(--irt-color-primary)"
themeVar("spacing.md", "16px");      // "var(--irt-space-md, 16px)"
const { theme } = useTheme();        // resolved JS values (client components)
```

## 6. Migrating from the old global variables

The previous components read un-prefixed globals from the host app
(`--color-primary`, `--spacing-sm`, `--colorRed`, …). Map them into a theme:

| Old variable | Theme key |
|---|---|
| `--color-primary` | `colors.primary` |
| `--color-error`, `--colorRed` | `colors.danger` |
| `--colorYellow` | `colors.warning` |
| `--color-info` | `colors.info` |
| `--color-text`, `--color-text-muted`, `--color-text-light` | `colors.text`, `colors.textMuted`, `colors.textSubtle` |
| `--color-background`, `--color-surface`, `--color-surface-light`, `--colorTableBg` | `colors.background`, `colors.surface`, `colors.surfaceMuted` |
| `--color-border`, `--color-border-light` | `colors.border`, `colors.borderMuted` |
| `--color-gray1…5`, `--colorGray3` | `colors.gray1…5` |
| `--color-white`, `--colorWhite` | `colors.white` |
| `--color-hover` | `colors.hover` |
| `--spacing-xs/sm/md/lg` | `spacing.xs/sm/md/lg` |
| `--radius-none/sm/md/lg` | `radius.*` |
| `--font-size`, `--size` | `typography.baseFontSize` |
| `--font-size-xs/sm/md/lg` | `typography.fontSize.*` |
| `--font-weight-*`, `--boldL2` | `typography.fontWeight.*` (`boldL2` → `semibold`) |
| `--transition-fast/normal` | `motion.duration.fast/normal` |
| `--shadow-md/lg` | `shadows.md/lg` |
| `--blur-backdrop` | `effects.backdropBlur` (full value, e.g. `"blur(4px)"`) |

Component-internal variables are namespaced `--irt-c-*` and are not part of
the public API.
