// Type-checks the snippets from docs/AI_USAGE_GUIDE.md against the packed package.
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Alert, AlertContainer, Button, Calendar, CheckboxGroup, DataSnapshotViewer, DataTableWithActions, DatePicker, Dialog,
  Dropdown, DropdownSimple, DynamicPopover, EmailInput, ErrorMsg, FileUpload, Icon, IconButton, IconError, ImageUpload,
  Loading, LoadingBorder, Modal, MultipleDropdown, OtpField, Pagination, PlainButton, Popover, RadioGroup, SearchBox,
  SingleDropdown, Slider, Stepper, Switch, Table, TextArea, TextInput, TimePicker, Tooltip, convertStrDate2Date,
  convertToMinutes, cssVars, themeVar, useTheme, type AlertItem, type AlertType, type IconName, type IconSvgProps,
  type SelectionValue, type TableColumn,
} from "@itsrighttime/irt-ui";
import { ThemeProvider, type ThemeConfig } from "@itsrighttime/irt-ui/theme";
import { IconProvider } from "@itsrighttime/irt-ui/icons";
import { Workspace, TabBar, Sidebar, useWorkspaceRoute, type WorkspaceConfig } from "@itsrighttime/irt-ui/layout";

export const theme = {
  colors: { primary: "#7c3aed", onPrimary: "#ffffff", secondary: "#475569" },
  typography: { fontFamily: { base: "Poppins, system-ui, sans-serif" } },
  radius: { md: "10px" },
  components: { button: { size: "medium" }, input: { variant: "outline" } },
  dark: { colors: { primary: "#a78bfa", onPrimary: "#1e1033" } },
} satisfies ThemeConfig;

interface User { id: number; name: string; email: string; status: string; address: { city: string } }
declare const api: { signup(f: unknown): Promise<void>; verifyOtp(id: string, code: string): Promise<boolean> };
declare const users: User[];

export function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", role: "", terms: false });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const set = <K extends keyof typeof form>(k: K) => (v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name) next.name = "Name is required";
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

declare function Link(p: { href: string; children?: ReactNode }): ReactNode;
function BrandClose(p: IconSvgProps) { return <svg {...p} />; }

export function Everything() {
  const [roles, setRoles] = useState<string[]>([]);
  const [channels, setChannels] = useState<SelectionValue[]>([]);
  const [plan, setPlan] = useState<SelectionValue>("free");
  const [due, setDue] = useState("");
  const [time, setTime] = useState("09:00 AM");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<string | null>("profile");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const notify = (message: string, type: AlertType = "success") => setAlerts((a) => [...a, { id: crypto.randomUUID(), message, type }]);
  const { resolvedMode, setMode } = useTheme();
  const name: IconName = "search";
  const columns: TableColumn<User>[] = [
    { key: "name", title: "Name", sortable: true },
    { key: "status", title: "Status", sortable: true, render: (u) => <b>{u.status}</b> },
    { key: "city", title: "City", render: (u) => u.address.city },
  ];
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <IconProvider icons={{ close: BrandClose }} strokeWidth={1.75}>
        <Button as="a" href="/docs" iconRight="externalLink">Docs</Button>
        <Button as={Link} href="/users" variant="tertiary">Users</Button>
        <Button iconOnly iconLeft="settings" ariaLabel="Settings" variant="ghost" />
        <IconButton icon="bell" label="Notifications" size={1.4} isBorder hoverBackground color="var(--irt-color-secondary)" />
        <IconButton icon={resolvedMode === "dark" ? "sun" : "moon"} label="Toggle theme" onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")} />
        <PlainButton onClick={() => notify("sent")}>Resend code</PlainButton>
        <TextArea label="Description" value="" setResult={() => undefined} maxLength={500} showCharacterCount showWordCount width="100%" />
        <OtpField length={6} verify={(code) => api.verifyOtp("u1", code)} setResult={(code) => code && notify(code)} setError={() => undefined} />
        <SearchBox suggestions={users.map((u) => ({ code: u.id, name: u.name }))} setResult={() => undefined} minChars={2} placeholder="Find user…" />
        <Dropdown options={["Admin", "Editor", "Viewer"]} placeholder="Role" value={roles} setResult={setRoles} multiple width="100%" />
        <MultipleDropdown options={["a"]} placeholder="Tags" value={roles} setResult={setRoles} addNew setAddedOptions={() => undefined} />
        <CheckboxGroup label="Notify by" options={[{ value: "email", label: "Email", help: "Daily digest" }, "SMS"]} value={channels} setResult={setChannels} layout="horizontal" />
        <RadioGroup label="Plan" options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro", disabled: true }]} value={plan} setResult={(v) => v && setPlan(v)} />
        <Slider label="Volume" value={3} setResult={() => undefined} min={0} max={100} step={5} showValueSide="right" />
        <Stepper label="Guests" value={2} setResult={() => undefined} min={1} max={10} step={1} />
        <DatePicker label="Due date" placeholder="dd-mm-yyyy" monthBase={1} value={due} setResult={(v) => setDue(String(v))} restrictionStartDate="01-01-2026" restrictionEndDate="31-12-2026" width="100%" />
        <Calendar mode="month-year" monthBase={1} setResult={() => undefined} />
        <TimePicker label="Start" value={time} setResult={setTime} minTime="08:00 AM" maxTime="06:00 PM" minuteStep={15} />
        <Modal isOpen={open} onClose={() => setOpen(false)} ariaLabel="Invite member"><p>x</p></Modal>
        <Dialog isOpen={open} onClose={() => setOpen(false)} title="Settings" activeKey={tab} onActiveKeyChange={setTab} items={[{ key: "profile", icon: "user", component: <p /> }, { key: "security", icon: "lock", label: "Security", component: <p /> }]} />
        <div ref={anchorRef}><Button onClick={() => setOpen((o) => !o)}>Filters</Button></div>
        <Popover anchorRef={anchorRef} isOpen={open} onClose={() => setOpen(false)} style={{ width: "auto" }}><p /></Popover>
        <DynamicPopover anchorRef={anchorRef} isOpen={open} onClose={() => setOpen(false)}>{({ placement }) => <p>{placement}</p>}</DynamicPopover>
        <div style={{ position: "relative", display: "inline-block" }}>
          <DropdownSimple isOpen={open} ariaLabel="Actions" onSelect={(key) => { notify(String(key)); setOpen(false); }}
            items={[{ key: "edit", value: "Edit", description: "⌘E" }, { key: "share", value: "Share", box: ["new"] }, { key: "archive", value: "Archive", disabled: true }, "Delete"]} />
        </div>
        <Tooltip content="Copy link" delay={300}><Button iconLeft="copy">Copy</Button></Tooltip>
        <AlertContainer alertContainer={alerts} removeAlert={(id) => setAlerts((a) => a.filter((x) => x.id !== id))} />
        <Alert type="info" message="…" duration={0} onDismiss={() => undefined} />
        <ErrorMsg message="Required" />
        <Loading type="BounceLoader" display="center" position="absolute" showText text="Loading users" />
        <LoadingBorder loading><p /></LoadingBorder>
        <IconError icon="imageOff" message="No image" size={2} />
        <Table<User> data={users} columns={columns} rowKey={(u) => u.id} pageSize={20} visibleColumns={["name", "email", "status"]}
          rowActions={[{ label: "Edit", onClick: (u) => setSelected(u) }]} controls={{ search: true, columnSelector: true, pagination: true }}
          showRowDetails={false} onCellClick={(u) => setSelected(u)} caption="Users" emptyText="No users yet" />
        <Pagination currentPage={1} totalPages={3} onPageChange={() => undefined} />
        <DataTableWithActions data={users} columns={columns} visibleColumns={["name"]} actionLabel="Manage" dialogTitle="Manage" dialogItems={[{ key: "security", icon: "lock", component: <p /> }]} onDialogOpenChange={(_o, row) => setSelected(row ?? null)} />
        <DataSnapshotViewer data={selected} title="Account" onClose={() => setSelected(null)} />
        <FileUpload setResult={() => undefined} allowedTypes={["application/pdf"]} maxSizeMb={5} maxFiles={3} />
        <ImageUpload requireSquare={false} setResult={() => undefined} />
        <Icon name={name} size={20} />
        <Icon name="alertTriangle" label="Warning" color="var(--irt-color-warning)" strokeWidth={1.5} />
        <Icon as={BrandClose} size={28} />
        <ThemeProvider theme={{ colors: { primary: "#c2410c" } }} scope="local"><p /></ThemeProvider>
        <p style={cssVars({ "--x": themeVar("spacing.md", "16px") })}>{convertToMinutes("01:30 PM")}{convertStrDate2Date("05-10-2026").getMonth()}</p>
      </IconProvider>
    </ThemeProvider>
  );
}

const config: WorkspaceConfig = {
  topPrimary: {
    center: [{ id: "dashboard", type: "text", text: "Dashboard", route: "/app" }],
    end: [
      { id: "notifications", type: "icon", icon: "bell", label: "Notifications" },
      { id: "account", type: "dropdown", trigger: { type: "icon", icon: "userCircle", label: "Account" }, items: [{ key: "profile", value: "Profile", route: "/app/profile" }, { key: "logout", value: "Log out" }] },
    ],
  },
  leftPrimary: { start: [{ id: "home", type: "icon", icon: "home", label: "Home", route: "/app" }] },
  leftSidebar: [
    { id: "crm", type: "group", title: "CRM", defaultOpen: true, children: [
      { id: "leads", type: "label", text: "Leads", route: "/app/leads", leftIcons: [{ icon: "target" }], tokens: [{ text: "12", background: "var(--irt-color-primary)", color: "var(--irt-color-on-primary)" }] },
    ] },
  ],
};

function Custom() { const { isRouteActive } = useWorkspaceRoute(); return <span>{String(isRouteActive("/app"))}</span>; }

export function Shell({ children, path, push }: { children: ReactNode; path: string; push: (r: string) => void }) {
  return (
    <>
      <Workspace config={config} currentPath={path} onNavigate={(route) => push(route)} onAction={({ id, key }) => console.log(id, key)}
        topPrimaryStart={<strong>Ada</strong>} visibility={{ alwaysVisible: ["home"], map: { crm: ["leads"] }, initialTab: "home" }}>
        {children}<Custom />
      </Workspace>
      <TabBar config={{ start: [{ id: "o", type: "text", text: "O" }] }} isRouteActive={() => false} />
      <Sidebar config={config.leftSidebar ?? []} position="leftSidebar" />
    </>
  );
}
