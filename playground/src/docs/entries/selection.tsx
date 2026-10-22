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
  type SelectionValue,
} from "@itsrighttime/irt-ui/atoms";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const fruits = ["Apple", "Banana", "Cherry", "Dragon fruit", "Elderberry", "Fig", "Grape", "Mango"];

const dropdownControls: Control[] = [
  { type: "boolean", name: "multiple", default: false },
  { type: "text", name: "placeholder", default: "Choose fruit" },
  { type: "boolean", name: "addNew", default: false },
  { type: "boolean", name: "required", default: false },
  { type: "boolean", name: "disabled", default: false },
  { type: "text", name: "width", default: "300px" },
];

function DropdownDemo({ v }: { v: ControlValues }) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="pg-stack">
      <Dropdown
        key={String(v.multiple)}
        options={fruits}
        multiple={Boolean(v.multiple)}
        placeholder={String(v.placeholder)}
        addNew={Boolean(v.addNew)}
        required={Boolean(v.required)}
        disabled={Boolean(v.disabled)}
        width={String(v.width)}
        value={selected}
        setResult={setSelected}
      />
      <small className="pg-muted">{JSON.stringify(selected)}</small>
    </div>
  );
}

function PresetDropdowns() {
  const [one, setOne] = useState("");
  const [many, setMany] = useState<string[]>(["Apple"]);
  return (
    <div className="pg-stack">
      <SingleDropdown options={fruits} placeholder="Single" value={one} setResult={setOne} />
      <MultipleDropdown options={fruits} placeholder="Multiple" value={many} setResult={setMany} />
    </div>
  );
}

const groupControls: Control[] = [
  { type: "text", name: "label", default: "Notifications" },
  { type: "select", name: "layout", default: "vertical", options: ["vertical", "horizontal"] },
  { type: "boolean", name: "required", default: false },
  { type: "boolean", name: "disabled", default: false },
  { type: "text", name: "width", default: "320px" },
];
const channelOptions = [
  { value: "email", label: "Email", help: "Daily digest" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push", help: "Mobile app only" },
  { value: "fax", label: "Fax", disabled: true },
];

function CheckboxDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState<SelectionValue[]>(["email"]);
  return (
    <div className="pg-stack">
      <CheckboxGroup
        options={channelOptions}
        value={value}
        setResult={setValue}
        label={String(v.label)}
        layout={v.layout as "vertical"}
        required={Boolean(v.required)}
        disabled={Boolean(v.disabled)}
        width={String(v.width)}
      />
      <small className="pg-muted">{JSON.stringify(value)}</small>
    </div>
  );
}

function RadioDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState<SelectionValue | null>("monthly");
  return (
    <div className="pg-stack">
      <RadioGroup
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly", help: "2 months free" },
          "Lifetime",
        ]}
        value={value ?? undefined}
        setResult={setValue}
        label={String(v.label)}
        layout={v.layout as "vertical"}
        required={Boolean(v.required)}
        disabled={Boolean(v.disabled)}
        width={String(v.width)}
      />
      <small className="pg-muted">{String(value)}</small>
    </div>
  );
}

function SwitchDemo({ v }: { v: ControlValues }) {
  const [on, setOn] = useState(true);
  return (
    <div className="pg-stack">
      <Switch label={String(v.label)} value={on} setResult={setOn} disabled={Boolean(v.disabled)} required={Boolean(v.required)} />
      <small className="pg-muted">{String(on)}</small>
    </div>
  );
}

function SliderDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState(40);
  return (
    <div className="pg-stack">
      <Slider
        label={String(v.label)}
        value={value}
        setResult={setValue}
        min={Number(v.min)}
        max={Number(v.max)}
        step={Number(v.step)}
        showRange={Boolean(v.showRange)}
        showValueSide={v.showValueSide as "none"}
        disabled={Boolean(v.disabled)}
      />
      <small className="pg-muted">{value}</small>
    </div>
  );
}

function StepperDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState(10);
  return (
    <Stepper label={String(v.label)} value={value} setResult={setValue} step={Number(v.step)} min={Number(v.min)} max={Number(v.max)} disabled={Boolean(v.disabled)} />
  );
}

const sliderControls: Control[] = [
  { type: "text", name: "label", default: "Volume" },
  { type: "number", name: "min", default: 0, min: 0, max: 50 },
  { type: "number", name: "max", default: 100, min: 50, max: 200, step: 10 },
  { type: "number", name: "step", default: 5, min: 1, max: 25 },
  { type: "boolean", name: "showRange", default: true },
  { type: "select", name: "showValueSide", default: "right", options: ["none", "left", "right", "top", "bottom"] },
  { type: "boolean", name: "disabled", default: false },
];

const stepperControls: Control[] = [
  { type: "text", name: "label", default: "Guests" },
  { type: "number", name: "step", default: 1, min: 1, max: 10 },
  { type: "number", name: "min", default: 0, min: 0, max: 5 },
  { type: "number", name: "max", default: 20, min: 5, max: 50 },
  { type: "boolean", name: "disabled", default: false },
];

export const selectionEntries: DocEntry[] = [
  {
    id: "dropdown",
    title: "Dropdown",
    group: "Selection",
    description: "Searchable single or multi-select with optional “add new”. Flips above the field when there is no room below.",
    imports: 'import { Dropdown, SingleDropdown, MultipleDropdown } from "@itsrighttime/irt-ui";',
    controls: dropdownControls,
    props: [
      { name: "options", type: "string[]", description: "Choices" },
      { name: "value / setResult", type: "string[] / (selected: string[]) => void", description: "Selection" },
      { name: "multiple", type: "boolean", description: "Multi-select with a selected list", default: "false" },
      { name: "addNew / setAddedOptions", type: "boolean / (options) => void", description: "Let users add options" },
      { name: "label", type: "string", description: "Floating label (defaults to placeholder)" },
    ],
    render: (v) => <DropdownDemo v={v} />,
    code: (v) => jsx("Dropdown", [["options", "{fruits}"], ...changed(dropdownControls, v), ["value", "{selected}"], ["setResult", "{setSelected}"]]),
    notes: (
      <>
        <p>Presets with a string / string[] value:</p>
        <PresetDropdowns />
      </>
    ),
  },
  {
    id: "checkbox-group",
    title: "CheckboxGroup",
    group: "Selection",
    description: "Multi-select group rendered with native (visually hidden) checkboxes — keyboard and form friendly. Options may be strings or objects with `help` and `disabled`.",
    imports: 'import { CheckboxGroup } from "@itsrighttime/irt-ui";',
    controls: groupControls,
    render: (v) => <CheckboxDemo v={v} />,
    code: (v) => jsx("CheckboxGroup", [["options", "{channels}"], ...changed(groupControls, v), ["value", "{value}"], ["setResult", "{setValue}"]]),
  },
  {
    id: "radio-group",
    title: "RadioGroup",
    group: "Selection",
    description: "Single-select radio group with native radios.",
    imports: 'import { RadioGroup } from "@itsrighttime/irt-ui";',
    controls: groupControls.map((c) => (c.name === "label" ? { ...c, default: "Billing" } : c)) as Control[],
    render: (v) => <RadioDemo v={v} />,
    code: (v) => jsx("RadioGroup", [["options", "{plans}"], ["label", v.label], ["layout", v.layout === "vertical" ? undefined : v.layout], ["value", "{plan}"], ["setResult", "{setPlan}"]]),
  },
  {
    id: "switch",
    title: "Switch",
    group: "Selection",
    description: "Accessible on/off toggle (`role=\"switch\"`, Space/Enter).",
    imports: 'import { Switch } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "text", name: "label", default: "Email notifications" },
      { type: "boolean", name: "required", default: false },
      { type: "boolean", name: "disabled", default: false },
    ],
    render: (v) => <SwitchDemo v={v} />,
    code: (v) => jsx("Switch", [["label", v.label], ["disabled", v.disabled || undefined], ["value", "{enabled}"], ["setResult", "{setEnabled}"]]),
  },
  {
    id: "slider",
    title: "Slider",
    group: "Selection",
    description: "Range input with − / + step buttons and optional value display.",
    imports: 'import { Slider } from "@itsrighttime/irt-ui";',
    controls: sliderControls,
    render: (v) => <SliderDemo v={v} />,
    code: (v) => jsx("Slider", [...changed(sliderControls, v), ["value", "{volume}"], ["setResult", "{setVolume}"]]),
  },
  {
    id: "stepper",
    title: "Stepper",
    group: "Selection",
    description: "Numeric value with − / + buttons, bounded by `min`/`max`.",
    imports: 'import { Stepper } from "@itsrighttime/irt-ui";',
    controls: stepperControls,
    render: (v) => <StepperDemo v={v} />,
    code: (v) => jsx("Stepper", [...changed(stepperControls, v), ["value", "{guests}"], ["setResult", "{setGuests}"]]),
  },
];
