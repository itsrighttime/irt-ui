import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Calendar,
  CheckboxGroup,
  Dropdown,
  IconButton,
  Loading,
  RadioGroup,
  Slider,
  Switch,
  Table,
  TextInput,
  Tabs,
  type SelectionValue,
  type TableColumn,
} from "@itsrighttime/irt-ui/atoms";
import { accounts } from "../docs/entries/data";

type Row = (typeof accounts)[number];
const columns: TableColumn<Row>[] = [
  { key: "name", title: "Name", sortable: true },
  { key: "role", title: "Role" },
  { key: "status", title: "Status" },
];

const SWATCHES = ["primary", "secondary", "accent", "success", "warning", "danger", "info", "background", "surface", "surface-muted", "text", "text-muted", "border", "border-strong"];

/** A dense showcase of components rendered with the current theme. */
export function ThemePreview() {
  const [name, setName] = useState("Ada Lovelace");
  const [roles, setRoles] = useState<string[]>(["Editor"]);
  const [on, setOn] = useState(true);
  const [channels, setChannels] = useState<SelectionValue[]>(["email"]);
  const [plan, setPlan] = useState<SelectionValue | null>("pro");
  const [volume, setVolume] = useState(60);

  return (
    <div className="pg-showcase">
      <section className="pg-card">
        <h3>Palette</h3>
        <div className="pg-swatches">
          {SWATCHES.map((s) => (
            <div key={s} className="pg-swatch">
              <span style={{ background: `var(--irt-color-${s})` }} />
              <code>{s}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="pg-card">
        <h3>Buttons</h3>
        <div className="pg-row">
          <Button iconLeft="check">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="ghost" iconLeft="settings">
            Ghost
          </Button>
          <Button variant="destructive" iconLeft="trash">
            Delete
          </Button>
          <Button loading>Saving</Button>
          <IconButton icon="bell" label="Notifications" variant="soft" />
        </div>
        <div className="pg-row">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="pg-card">
        <h3>Form</h3>
        <div className="pg-grid-2">
          <TextInput label="Name" value={name} setResult={setName} width="100%" helperText="Shown on your profile" />
          <TextInput label="Email" textType="email" iconLeft="mail" width="100%" error="Enter a valid email" value="ada@" />
          <Dropdown options={["Admin", "Editor", "Viewer"]} multiple placeholder="Roles" value={roles} setResult={setRoles} width="100%" />
          <Switch label="Two-factor authentication" value={on} setResult={setOn} width="100%" />
          <CheckboxGroup
            label="Notify me by"
            options={[
              { value: "email", label: "Email" },
              { value: "sms", label: "SMS" },
            ]}
            value={channels}
            setResult={setChannels}
            layout="horizontal"
            width="100%"
          />
          <RadioGroup
            label="Plan"
            options={[
              { value: "free", label: "Free" },
              { value: "pro", label: "Pro" },
            ]}
            value={plan ?? undefined}
            setResult={setPlan}
            layout="horizontal"
            width="100%"
          />
        </div>
        <Slider label="Volume" value={volume} setResult={setVolume} showValueSide="right" width="100%" />
      </section>

      <section className="pg-card">
        <h3>Feedback</h3>
        <div className="pg-stack">
          <Alert type="success" title="Changes saved" message="Your profile is up to date." duration={0} onDismiss={() => undefined} />
          <Alert type="error" message="Payment failed — check your card details." duration={0} onDismiss={() => undefined} />
          <div className="pg-row">
            <Badge tone="success" dot>
              Online
            </Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger" variant="solid">
              3
            </Badge>
          </div>
          <div style={{ position: "relative", height: 90 }}>
            <Loading type="BounceLoader" display="center" position="absolute" />
          </div>
        </div>
      </section>

      <section className="pg-card pg-span-2">
        <h3>Data</h3>
        <Table<Row> data={accounts} columns={columns} rowKey={(a) => a.id} pageSize={4} controls={{ columnSelector: false }} />
      </section>

      <section className="pg-card">
        <h3>Tabs</h3>
        <Tabs
          ariaLabel="Preview tabs"
          variant="enclosed"
          size="small"
          items={[
            { key: "a", label: "Overview" },
            { key: "b", label: "Activity", badge: 4 },
            { key: "c", label: "Settings" },
          ]}
        />
        <h3 style={{ marginTop: "var(--irt-space-md)" }}>Calendar</h3>
        <Calendar setResult={() => undefined} monthBase={1} isSmall />
      </section>
    </div>
  );
}
