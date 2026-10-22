import { useState } from "react";
import {
  AddressInput,
  EmailInput,
  JsonField,
  MobileInput,
  NumberInput,
  OtpField,
  PasswordInput,
  SearchBox,
  TextArea,
  TextInput,
  UrlInput,
  googleFaviconResolver,
  type AddressValue,
} from "@itsrighttime/irt-ui/atoms";
import type { IconName } from "@itsrighttime/irt-ui/icons";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const textControls: Control[] = [
  { type: "text", name: "label", default: "Full name" },
  { type: "text", name: "placeholder", default: "" },
  { type: "select", name: "variant", default: "outline", options: ["outline", "filled", "ghost", "underline"] },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"] },
  { type: "select", name: "radius", default: "md", options: ["none", "sm", "md", "lg"] },
  { type: "select", name: "iconLeft", default: "none", options: ["none", "user", "search", "mail", "lock"] },
  { type: "text", name: "helperText", default: "As shown on your ID" },
  { type: "text", name: "error", default: "" },
  { type: "text", name: "width", default: "300px" },
  { type: "boolean", name: "required", default: false },
  { type: "boolean", name: "loading", default: false },
  { type: "boolean", name: "disabled", default: false },
];

function TextInputDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState("");
  return (
    <div className="pg-stack">
      <TextInput
        label={String(v.label) || undefined}
        placeholder={String(v.placeholder) || undefined}
        variant={v.variant as "outline"}
        size={v.size as "medium"}
        radius={v.radius as "md"}
        iconLeft={v.iconLeft === "none" ? undefined : (v.iconLeft as IconName)}
        helperText={String(v.helperText) || undefined}
        error={String(v.error) || undefined}
        width={String(v.width)}
        required={Boolean(v.required)}
        loading={Boolean(v.loading)}
        disabled={Boolean(v.disabled)}
        value={value}
        setResult={setValue}
      />
      <small className="pg-muted">setResult → “{value}”</small>
    </div>
  );
}

function PresetsDemo() {
  const [values, setValues] = useState<Record<string, string>>({});
  const set = (k: string) => (v: string) => setValues((s) => ({ ...s, [k]: v }));
  return (
    <div className="pg-stack">
      <EmailInput label="Email" value={values.email ?? ""} setResult={set("email")} />
      <PasswordInput label="Password" value={values.password ?? ""} setResult={set("password")} />
      <MobileInput label="Mobile" value={values.mobile ?? ""} setResult={set("mobile")} helperText="Only digits and + are kept" />
      <NumberInput label="Quantity" value={values.qty ?? ""} setResult={set("qty")} />
      <UrlInput label="Website" setResult={set("url")} faviconResolver={googleFaviconResolver} helperText="Favicon lookup is opt-in" />
      <small className="pg-muted">{JSON.stringify(values)}</small>
    </div>
  );
}

const textAreaControls: Control[] = [
  { type: "text", name: "label", default: "Description" },
  { type: "number", name: "maxLength", default: 200, min: 10, max: 500, step: 10 },
  { type: "number", name: "minLength", default: 0, min: 0, max: 50 },
  { type: "boolean", name: "showCharacterCount", default: true },
  { type: "boolean", name: "showWordCount", default: true },
  { type: "boolean", name: "required", default: false },
  { type: "boolean", name: "disabled", default: false },
  { type: "text", name: "width", default: "360px" },
];

function TextAreaDemo({ v }: { v: ControlValues }) {
  const [text, setText] = useState("");
  return (
    <div className="pg-stack">
      <TextArea
        label={String(v.label)}
        maxLength={Number(v.maxLength)}
        minLength={Number(v.minLength) || undefined}
        showCharacterCount={Boolean(v.showCharacterCount)}
        showWordCount={Boolean(v.showWordCount)}
        required={Boolean(v.required)}
        disabled={Boolean(v.disabled)}
        width={String(v.width)}
        value={text}
        setResult={setText}
      />
      <small className="pg-muted">Emits on blur: “{text}”</small>
    </div>
  );
}

function JsonDemo() {
  const [json, setJson] = useState("");
  const [valid, setValid] = useState<boolean | null>(null);
  return (
    <div className="pg-stack">
      <JsonField label="Payload" value={'{"name":"irt","tags":["ui"]}'} setResult={setJson} setIsFieldValid={setValid} width="360px" isBorder />
      <small className="pg-muted">valid: {String(valid)} {json && `· saved ${json.length} chars`}</small>
    </div>
  );
}

function AddressDemo() {
  const [address, setAddress] = useState<AddressValue>({});
  return (
    <div className="pg-stack">
      <AddressInput isHouse isStreet isCity isState isPostal isCountry value={address} setResult={setAddress} width="320px" />
      <small className="pg-muted">{JSON.stringify(address)}</small>
    </div>
  );
}

function OtpDemo({ v }: { v: ControlValues }) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  return (
    <div className="pg-stack">
      <OtpField
        key={`${v.length}-${v.verify}`}
        length={Number(v.length)}
        isNumeric={Boolean(v.isNumeric)}
        setResult={setResult}
        setError={setError}
        verify={v.verify ? async (code) => code === "1".repeat(Number(v.length)) : undefined}
        resetDelay={1500}
      />
      <small className="pg-muted">
        {v.verify ? `Demo verifier accepts ${"1".repeat(Number(v.length))}. ` : ""}result: {String(result)} {error && `· ${error}`}
      </small>
    </div>
  );
}

const cities = ["Mumbai", "Mysuru", "Delhi", "Dehradun", "Pune", "Patna", "Bengaluru", "Bhopal", "Chennai", "Kolkata"].map((name, i) => ({ code: i + 1, name }));

function SearchDemo({ v }: { v: ControlValues }) {
  const [picked, setPicked] = useState<string | number>("");
  return (
    <div className="pg-stack">
      <SearchBox suggestions={cities} setResult={setPicked} minChars={Number(v.minChars)} placeholder={String(v.placeholder)} />
      <small className="pg-muted">selected code: {String(picked)}</small>
    </div>
  );
}

export const inputEntries: DocEntry[] = [
  {
    id: "text-input",
    title: "TextInput",
    group: "Inputs",
    description:
      "Text field with a floating label, icons, helper/error text, loading and password toggle. Extends native input attributes; `setResult` receives the string value (your `onChange` still runs).",
    imports: 'import { TextInput } from "@itsrighttime/irt-ui";',
    controls: textControls,
    props: [
      { name: "label", type: "string", description: "Floating label, also the placeholder while empty" },
      { name: "setResult", type: "(value: string) => void", description: "Called on every change" },
      { name: "variant", type: '"outline" | "filled" | "ghost" | "underline"', description: "Style", default: "theme" },
      { name: "textType", type: '"text" | "password" | "number" | "email" | "tel" | "url" | "search"', description: "Native type", default: '"text"' },
      { name: "error / helperText", type: "string", description: "Linked via aria-describedby" },
      { name: "iconLeft / iconRight", type: "IconName | ReactNode", description: "Adornments" },
    ],
    render: (v) => <TextInputDemo v={v} />,
    code: (v) =>
      jsx("TextInput", [
        ...changed(textControls, v),
        ["value", "{name}"],
        ["setResult", "{setName}"],
      ]),
  },
  {
    id: "input-presets",
    title: "Input presets",
    group: "Inputs",
    description: "EmailInput, PasswordInput, MobileInput, NumberInput and UrlInput are TextInput presets with the right type, keyboard and autocomplete.",
    imports: 'import { EmailInput, PasswordInput, MobileInput, NumberInput, UrlInput } from "@itsrighttime/irt-ui";',
    render: () => <PresetsDemo />,
    code: () =>
      [
        '<EmailInput label="Email" value={email} setResult={setEmail} />',
        '<PasswordInput label="Password" value={password} setResult={setPassword} />',
        '<MobileInput label="Mobile" value={mobile} setResult={setMobile} />',
        '<NumberInput label="Quantity" value={qty} setResult={setQty} />',
        "// Favicon preview is opt-in (it calls a third-party service):",
        '<UrlInput label="Website" setResult={setUrl} faviconResolver={googleFaviconResolver} />',
      ].join("\n"),
  },
  {
    id: "text-area",
    title: "TextArea",
    group: "Inputs",
    description: "Auto-growing textarea with min/max length validation and character/word counters. Emits on blur.",
    imports: 'import { TextArea } from "@itsrighttime/irt-ui";',
    controls: textAreaControls,
    render: (v) => <TextAreaDemo v={v} />,
    code: (v) => jsx("TextArea", [...changed(textAreaControls, v), ["value", "{text}"], ["setResult", "{setText}"]]),
  },
  {
    id: "json-field",
    title: "JsonField",
    group: "Inputs",
    description: "JSON editor: “Validate & Save” pretty-prints valid JSON and reports errors.",
    imports: 'import { JsonField } from "@itsrighttime/irt-ui";',
    render: () => <JsonDemo />,
    code: () => '<JsonField label="Payload" setResult={setJson} setIsFieldValid={setValid} isBorder />',
  },
  {
    id: "address-input",
    title: "AddressInput",
    group: "Inputs",
    description: "Composite address form. Enable fields with the `is*` flags; `setResult` receives the merged object.",
    imports: 'import { AddressInput, type AddressValue } from "@itsrighttime/irt-ui";',
    render: () => <AddressDemo />,
    code: () => "<AddressInput isHouse isStreet isCity isState isPostal isCountry value={address} setResult={setAddress} />",
  },
  {
    id: "otp-field",
    title: "OtpField",
    group: "Inputs",
    description: "One-time-code input with paste support. Pass `verify` (e.g. your API call) to validate; without it the completed code is emitted.",
    imports: 'import { OtpField } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "number", name: "length", default: 6, min: 4, max: 8 },
      { type: "boolean", name: "isNumeric", default: true },
      { type: "boolean", name: "verify", label: "verify (demo)", default: true },
    ],
    render: (v) => <OtpDemo v={v} />,
    code: (v) =>
      jsx("OtpField", [
        ["length", v.length === 6 ? undefined : v.length],
        ["isNumeric", v.isNumeric ? undefined : false],
        ["verify", v.verify ? "{(code) => api.verifyOtp(userId, code)}" : undefined],
        ["setResult", "{onVerified}"],
        ["setError", "{setError}"],
      ]),
  },
  {
    id: "search-box",
    title: "SearchBox",
    group: "Inputs",
    description: "Autocomplete over a list of `{ code, name }` suggestions (ARIA combobox with keyboard navigation).",
    imports: 'import { SearchBox } from "@itsrighttime/irt-ui";',
    controls: [
      { type: "number", name: "minChars", default: 2, min: 1, max: 4 },
      { type: "text", name: "placeholder", default: "Search a city…" },
    ],
    render: (v) => <SearchDemo v={v} />,
    code: (v) => jsx("SearchBox", [["suggestions", "{cities}"], ["minChars", v.minChars], ["placeholder", v.placeholder], ["setResult", "{setCityCode}"]]),
  },
];
