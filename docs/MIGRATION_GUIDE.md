# Migration guide — from the in-app `atoms` / `layouts` folders

## 1. Install and wire up

1. Install `@itsrighttime/irt-ui` (see README) and remove the copied folders.
2. Replace imports: `@/atoms` → `@itsrighttime/irt-ui` (or `/atoms`), `layouts` → `@itsrighttime/irt-ui/layout`.
3. Import `@itsrighttime/irt-ui/styles.css` once and wrap the app in `<ThemeProvider theme={…}>`.
4. Move your global `--color-*` / `--spacing-*` values into the theme (mapping table in [THEME_GUIDE §6](THEME_GUIDE.md#6-migrating-from-the-old-global-variables)).

## 2. Breaking changes

| Area | Before | Now |
|---|---|---|
| Icons | `icon={Icons.crossIcon}` | `icon="close"` (nodes still accepted; legacy string names like `"crossIcon"` still resolve, deprecated) |
| Workspace | read `useAuth`, `useWsHandlers`, `useNavigate`, `<Outlet/>`, hardcoded nav config | `<Workspace config currentPath onNavigate onAction topPrimaryStart visibility>{children}</Workspace>` |
| `TabConfig.icon` | `IconTypes` from `@/assets` | `IconName` (legacy names accepted) |
| ErrorPage | string `handleNavigate` used react-router | string renders a link; pass `onNavigate={navigate}` for client routing |
| Dialog | synced `?dialog=&tab=` via react-router (`dialogKey`, `tabKey`) | `activeKey` / `defaultActiveKey` / `onActiveKeyChange` (sync to the URL yourself) |
| DataTableWithActions | URL-driven via react-router | `isDialogOpen`/`onDialogOpenChange`, `activeDialogKey`/`onActiveDialogKeyChange` (uncontrolled by default) |
| OtpField | `verificationEndpoint`, `userId` (called `apiCaller`) | `verify={(code) => api.verify(code)}` returning `boolean \| { success, message? }`; without `verify` the code is emitted directly |
| UrlInput | always requested Google's favicon service | `faviconResolver={googleFaviconResolver}` to opt in |
| LoadingBorder | default export only | named export (default kept, deprecated) |
| CSS variables | un-prefixed globals | `--irt-*` tokens via ThemeProvider |
| Table | `T extends Record<string, any>`; column toggle by title | `T extends object`; visibility tracked by column `key`; sortable columns implemented |
| Calendar | `restrictionStartDate`/`EndDate` required | optional |

## 3. Behaviour fixes you may notice

- **Slider**: the − / + buttons now call `setResult` (they only changed the UI before).
- **TimePicker**: `setResult` is called once per change (was twice).
- **Slider / Stepper / Switch / Dropdown / FileUpload / TextArea / TimePicker**: re-sync when the `value` prop changes.
- **TextInput**: `placeholder` is honoured when there is no `label`; your `onChange` and `setResult` are both called.
- **NumberInput**: no longer sets `autocomplete="cc-number"`.
- **DataSnapshotViewer**: only ISO-like strings are formatted as dates (previously `"5"` became a date); fixed a hooks-order crash when `data` toggled.
- **VideoPlayer**: object URLs are created once per file and revoked (was leaking each render).
- **Alert**: `info` uses the info colour (was the warning colour); new `warning` style; `duration` prop.
- **Modal**: clicking the close button no longer calls `onClose` twice.
- **Workspace routes**: absolute routes now match (`"/workspace/documents"` was never active); a base-only route (`"/workspace/"`) matches exactly.

## 4. Calendar month numbering (decision pending)

The Calendar historically emits **0-based** months inside `"dd-mm-yyyy"`
(`05-09-2026` for 5 Oct 2026) and for `MonthPicker` (January = `0`), while
`restriction*Date` inputs are parsed as **1-based**. This is preserved by
default. Pass `monthBase={1}` to get calendar months (`05-10-2026`, January = `1`).
The default is planned to switch to `1` in the next major version.
