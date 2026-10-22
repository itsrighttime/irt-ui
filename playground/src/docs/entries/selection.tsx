import { useState } from "react";
import {
  CheckboxGroup,
  Dropdown,
  MultipleDropdown,
  RadioGroup,
  SingleDropdown,
  Slider,
  Stepper,
  Switch,
  type DropdownOption,
  type SelectionValue,
} from "@itsrighttime/irt-ui/atoms";
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const fruits = ["Apple", "Banana", "Cherry", "Dragon fruit", "Elderberry", "Fig", "Grape", "Mango"];
const plans: DropdownOption[] = [
  { value: "free", label: "Free", description: "1 project, community support", icon: "user" },
  { value: "pro", label: "Pro", description: "Unlimited projects", icon: "star" },
  { value: "team", label: "Team", description: "SSO and audit log", icon: "users" },
  { value: "enterprise", label: "Enterprise", description: "Contact sales", icon: "lock", disabled: true },
];

const dropdownControls: Control[] = [
  { type: "select", name: "options", label: "options", default: "strings", options: ["strings", "objects"], group: "Content", hint: "Plain strings or { value, label, description, icon, disabled }" },
  { type: "text", name: "placeholder", default: "Choose fruit", group: "Content" },
  { type: "text", name: "label", default: "", group: "Content", placeholder: "= placeholder", hint: "Floating label once a value is selected" },
  { type: "text", name: "helperText", default: "", group: "Content", placeholder: "none" },
  { type: "boolean", name: "multiple", default: false, group: "Behavior" },
  { type: "boolean", name: "searchable", default: true, group: "Behavior" },
  { type: "boolean", name: "addNew", default: false, group: "Behavior" },
  { type: "text", name: "emptyText", default: "No options", libDefault: "No options", group: "Behavior" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"], group: "Appearance" },
  { type: "text", name: "width", default: "300px", group: "Appearance" },
  { type: "number", name: "maxMenuHeight", default: 300, min: 160, max: 480, step: 20, group: "Appearance" },
  { type: "text", name: "error", default: "", group: "Validation", placeholder: "no error" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function DropdownDemo({ v }: { v: ControlValues }) {
  const [selected, setSelected] = useState<string[]>([]);
  const log = useLog();
  return (
    <Dropdown
      key={`${String(v.multiple)}-${String(v.options)}`}
      options={v.options === "objects" ? plans : fruits}
      multiple={Boolean(v.multiple)}
      placeholder={String(v.placeholder)}
      label={String(v.label) || undefined}
      helperText={String(v.helperText) || undefined}
      error={String(v.error) || undefined}
      searchable={Boolean(v.searchable)}
      emptyText={String(v.emptyText)}
      size={v.size as "medium"}
      maxMenuHeight={Number(v.maxMenuHeight)}
      addNew={Boolean(v.addNew)}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
      value={selected}
      onOpenChange={(open) => log("onOpenChange", open)}
      setAddedOptions={(options) => log("setAddedOptions", options)}
      setResult={(next) => {
        setSelected(next);
        log("setResult", next);
      }}
    />
  );
}

function PresetDropdowns() {
  const [one, setOne] = useState("");
  const [many, setMany] = useState<string[]>(["Apple", "Fig"]);
  const log = useLog();
  return (
    <div className="pg-form">
      <SingleDropdown
        options={fruits}
        placeholder="Favourite fruit"
        value={one}
        width="100%"
        setResult={(v) => {
          setOne(v);
          log("SingleDropdown.setResult", v);
        }}
      />
      <MultipleDropdown
        options={fruits}
        placeholder="Basket"
        value={many}
        width="100%"
        setResult={(v) => {
          setMany(v);
          log("MultipleDropdown.setResult", v);
        }}
      />
    </div>
  );
}

const groupControls = (label: string): Control[] => [
  { type: "text", name: "label", default: label, group: "Content" },
  { type: "text", name: "helperText", default: "", group: "Content", placeholder: "none" },
  { type: "select", name: "layout", default: "vertical", options: ["vertical", "horizontal"], group: "Appearance" },
  { type: "select", name: "variant", default: "default", options: ["default", "card"], group: "Appearance" },
  { type: "text", name: "width", default: "340px", group: "Appearance" },
  { type: "text", name: "error", default: "", group: "Validation", placeholder: "no error" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];
const checkboxControls = groupControls("Notifications");
const radioControls = groupControls("Billing");

const channelOptions = [
  { value: "email", label: "Email", help: "Daily digest" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push", help: "Mobile app only" },
  { value: "fax", label: "Fax", disabled: true },
];

function CheckboxDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState<SelectionValue[]>(["email"]);
  const log = useLog();
  return (
    <CheckboxGroup
      options={channelOptions}
      value={value}
      setResult={(next) => {
        setValue(next);
        log("setResult", next);
      }}
      label={String(v.label)}
      helperText={String(v.helperText) || undefined}
      error={String(v.error) || undefined}
      layout={v.layout as "vertical"}
      variant={v.variant as "default"}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
    />
  );
}

function RadioDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState<SelectionValue | null>("monthly");
  const log = useLog();
  return (
    <RadioGroup
      options={[
        { value: "monthly", label: "Monthly", help: "$12 / month" },
        { value: "yearly", label: "Yearly", help: "$120 / year — 2 months free" },
        "Lifetime",
      ]}
      value={value ?? undefined}
      setResult={(next) => {
        setValue(next);
        log("setResult", next);
      }}
      label={String(v.label)}
      helperText={String(v.helperText) || undefined}
      error={String(v.error) || undefined}
      layout={v.layout as "vertical"}
      variant={v.variant as "default"}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
    />
  );
}

const switchControls: Control[] = [
  { type: "text", name: "label", default: "Email notifications", group: "Content" },
  { type: "text", name: "description", default: "Weekly summary of activity", group: "Content" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"], group: "Appearance" },
  { type: "select", name: "labelPosition", default: "start", options: ["start", "end"], group: "Appearance" },
  { type: "boolean", name: "spread", default: false, group: "Appearance", hint: "Settings-row layout" },
  { type: "text", name: "width", default: "320px", group: "Appearance" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function SwitchDemo({ v }: { v: ControlValues }) {
  const [on, setOn] = useState(true);
  const log = useLog();
  return (
    <Switch
      label={String(v.label) || undefined}
      ariaLabel={String(v.label) ? undefined : "Toggle"}
      description={String(v.description) || undefined}
      size={v.size as "medium"}
      labelPosition={v.labelPosition as "start"}
      spread={Boolean(v.spread)}
      width={String(v.width)}
      value={on}
      setResult={(next) => {
        setOn(next);
        log("setResult", next);
      }}
      disabled={Boolean(v.disabled)}
      required={Boolean(v.required)}
    />
  );
}

const sliderControls: Control[] = [
  { type: "text", name: "label", default: "Volume", group: "Content" },
  { type: "text", name: "helperText", default: "", group: "Content", placeholder: "none" },
  { type: "select", name: "format", default: "none", options: ["none", "percent", "currency"], group: "Content", hint: "formatValue" },
  { type: "number", name: "min", default: 0, min: 0, max: 50, group: "Range" },
  { type: "number", name: "max", default: 100, min: 50, max: 200, step: 10, group: "Range" },
  { type: "number", name: "step", default: 5, min: 1, max: 25, group: "Range", libDefault: 1 },
  { type: "boolean", name: "showRange", default: true, group: "Appearance" },
  { type: "boolean", name: "showButtons", default: true, group: "Appearance" },
  { type: "select", name: "showValueSide", default: "right", options: ["none", "left", "right", "top", "bottom"], group: "Appearance" },
  { type: "text", name: "width", default: "320px", group: "Appearance" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

const FORMATS: Record<string, ((v: number) => string) | undefined> = {
  none: undefined,
  percent: (v) => `${v}%`,
  currency: (v) => `$${v}`,
};

function SliderDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState(40);
  const log = useLog();
  return (
    <Slider
      label={String(v.label)}
      helperText={String(v.helperText) || undefined}
      formatValue={FORMATS[String(v.format)]}
      value={value}
      setResult={(next) => {
        setValue(next);
        log("setResult", next);
      }}
      min={Number(v.min)}
      max={Number(v.max)}
      step={Number(v.step)}
      showRange={Boolean(v.showRange)}
      showButtons={Boolean(v.showButtons)}
      showValueSide={v.showValueSide as "none"}
      width={String(v.width)}
      disabled={Boolean(v.disabled)}
    />
  );
}

const stepperControls: Control[] = [
  { type: "text", name: "label", default: "Guests", group: "Content" },
  { type: "text", name: "helperText", default: "", group: "Content", placeholder: "none" },
  { type: "number", name: "step", default: 1, min: 1, max: 10, group: "Range", libDefault: 5 },
  { type: "number", name: "min", default: 0, min: 0, max: 5, group: "Range" },
  { type: "number", name: "max", default: 20, min: 5, max: 50, group: "Range", libDefault: 100 },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"], group: "Appearance" },
  { type: "select", name: "align", default: "center", options: ["center", "start"], group: "Appearance" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function StepperDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState(2);
  const log = useLog();
  return (
    <Stepper
      label={String(v.label)}
      helperText={String(v.helperText) || undefined}
      value={value}
      setResult={(next) => {
        setValue(next);
        log("setResult", next);
      }}
      step={Number(v.step)}
      min={Number(v.min)}
      max={Number(v.max)}
      size={v.size as "medium"}
      align={v.align as "center"}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
    />
  );
}

export const selectionEntries: DocEntry[] = [
  {
    id: "dropdown",
    title: "Dropdown",
    group: "Selection",
    description:
      "Searchable single or multi-select. Options are strings or `{ value, label, description, icon, disabled }` objects. Keyboard: Enter/↓ opens, ↑/↓/Home/End move, Enter selects, Escape closes, Backspace clears. Flips above the field when there is no room below.",
    imports: 'import { Dropdown, SingleDropdown, MultipleDropdown, type DropdownOption } from "@itsrighttime/irt-ui";',
    components: ["Dropdown", "SingleDropdown", "MultipleDropdown"],
    controls: dropdownControls,
    render: (v) => <DropdownDemo v={v} />,
    code: (v) =>
      jsx("Dropdown", [
        ["options", v.options === "objects" ? "{plans}" : "{fruits}"],
        ...changed(
          dropdownControls.filter((c) => c.name !== "options"),
          v,
        ),
        ["value", "{selected}"],
        ["setResult", "{setSelected}"],
      ]),
    examples: [
      {
        title: "SingleDropdown / MultipleDropdown",
        description: "Presets with a `string` / `string[]` value.",
        render: () => <PresetDropdowns />,
        code: '<SingleDropdown options={fruits} placeholder="Favourite fruit" value={fruit} setResult={setFruit} />\n<MultipleDropdown options={fruits} placeholder="Basket" value={basket} setResult={setBasket} />',
      },
      {
        title: "Rich options",
        description: "Descriptions, icons and disabled options.",
        render: () => <Dropdown options={plans} placeholder="Plan" value={["pro"]} setResult={() => undefined} width="100%" />,
        code: 'const plans: DropdownOption[] = [\n  { value: "free", label: "Free", description: "1 project", icon: "user" },\n  { value: "pro", label: "Pro", description: "Unlimited projects", icon: "star" },\n  { value: "enterprise", label: "Enterprise", disabled: true },\n];\n<Dropdown options={plans} placeholder="Plan" value={plan} setResult={setPlan} />',
      },
      {
        title: "Validation",
        render: () => (
          <div className="pg-form">
            <Dropdown options={fruits} placeholder="Fruit" required error="Pick a fruit" setResult={() => undefined} width="100%" />
            <Dropdown options={fruits} placeholder="Fruit" helperText="You can change this later" setResult={() => undefined} width="100%" size="small" />
          </div>
        ),
        code: '<Dropdown options={fruits} placeholder="Fruit" required error="Pick a fruit" setResult={setFruit} />',
      },
    ],
  },
  {
    id: "checkbox-group",
    title: "CheckboxGroup",
    group: "Selection",
    description:
      "Multi-select group rendered with native (visually hidden) checkboxes — keyboard and form friendly. Options may be strings or objects with `help` and `disabled`. `variant=\"card\"` renders each option as a selectable card.",
    imports: 'import { CheckboxGroup } from "@itsrighttime/irt-ui";',
    controls: checkboxControls,
    render: (v) => <CheckboxDemo v={v} />,
    code: (v) => jsx("CheckboxGroup", [["options", "{channels}"], ...changed(checkboxControls, v), ["value", "{value}"], ["setResult", "{setValue}"]]),
  },
  {
    id: "radio-group",
    title: "RadioGroup",
    group: "Selection",
    description: "Single-select radio group with native radios (arrow keys move the selection). Same options, layouts and variants as CheckboxGroup.",
    imports: 'import { RadioGroup } from "@itsrighttime/irt-ui";',
    controls: radioControls,
    render: (v) => <RadioDemo v={v} />,
    code: (v) => jsx("RadioGroup", [["options", "{plans}"], ...changed(radioControls, v), ["value", "{plan}"], ["setResult", "{setPlan}"]]),
  },
  {
    id: "switch",
    title: "Switch",
    group: "Selection",
    description: "Accessible on/off toggle (`role=\"switch\"`, Space/Enter) with three sizes, an optional description and a settings-row (`spread`) layout.",
    imports: 'import { Switch } from "@itsrighttime/irt-ui";',
    controls: switchControls,
    render: (v) => <SwitchDemo v={v} />,
    code: (v) => jsx("Switch", [...changed(switchControls, v), ["value", "{enabled}"], ["setResult", "{setEnabled}"]]),
    examples: [
      {
        title: "Settings list",
        render: () => (
          <div className="pg-settings-list">
            <Switch label="Product updates" description="New features and improvements" value spread width="100%" setResult={() => undefined} />
            <Switch label="Security alerts" description="Sign-ins from new devices" value spread width="100%" setResult={() => undefined} />
            <Switch label="Marketing" value={false} spread width="100%" setResult={() => undefined} disabled />
          </div>
        ),
        code: '<Switch label="Product updates" description="New features and improvements" spread width="100%" value={on} setResult={setOn} />',
      },
      {
        title: "Sizes",
        render: () => (
          <>
            <Switch ariaLabel="Small" size="small" value setResult={() => undefined} width="auto" />
            <Switch ariaLabel="Medium" value setResult={() => undefined} width="auto" />
            <Switch ariaLabel="Large" size="large" value setResult={() => undefined} width="auto" />
          </>
        ),
        code: '<Switch ariaLabel="Small" size="small" value={on} setResult={setOn} />\n<Switch ariaLabel="Large" size="large" value={on} setResult={setOn} />',
      },
    ],
  },
  {
    id: "slider",
    title: "Slider",
    group: "Selection",
    description: "Range input with optional − / + step buttons, range labels, a formatted value display and helper text. Native `<input type=\"range\">` underneath.",
    imports: 'import { Slider } from "@itsrighttime/irt-ui";',
    controls: sliderControls,
    render: (v) => <SliderDemo v={v} />,
    code: (v) =>
      jsx("Slider", [
        ...changed(
          sliderControls.filter((c) => c.name !== "format"),
          v,
        ),
        ["formatValue", v.format === "percent" ? "{(v) => `${v}%`}" : v.format === "currency" ? "{(v) => `$${v}`}" : undefined],
        ["value", "{volume}"],
        ["setResult", "{setVolume}"],
      ]),
  },
  {
    id: "stepper",
    title: "Stepper",
    group: "Selection",
    description: "Bounded numeric value with − / + buttons. The value is a `spinbutton`: ↑/↓ step, PageUp/PageDown jump ×10, Home/End go to min/max.",
    imports: 'import { Stepper } from "@itsrighttime/irt-ui";',
    controls: stepperControls,
    render: (v) => <StepperDemo v={v} />,
    code: (v) => jsx("Stepper", [...changed(stepperControls, v), ["value", "{guests}"], ["setResult", "{setGuests}"]]),
  },
];
