import { useState } from "react";
import {
  AddressInput,
  EmailInput,
  ErrorMsg,
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
import { useLog } from "../../state/events";
import { changed, jsx } from "../jsx";
import type { Control, ControlValues, DocEntry } from "../types";

const icon = (v: unknown) => (v === "none" ? undefined : (v as IconName));

const textControls: Control[] = [
  { type: "text", name: "label", default: "Full name", group: "Content", hint: "Floats above the field once it has a value" },
  { type: "text", name: "placeholder", default: "", group: "Content", hint: "Used when there is no label" },
  { type: "text", name: "helperText", default: "As shown on your ID", group: "Content" },
  { type: "select", name: "iconLeft", default: "none", options: ["none", "user", "search", "mail", "lock", "phone"], group: "Content" },
  { type: "select", name: "iconRight", default: "none", options: ["none", "check", "info", "calendar"], group: "Content" },
  { type: "select", name: "textType", default: "text", options: ["text", "password", "email", "number", "tel", "url", "search"], group: "Behavior" },
  { type: "text", name: "maxLength", default: "", group: "Behavior", placeholder: "none" },
  { type: "select", name: "variant", default: "outline", options: ["outline", "filled", "ghost", "underline"], group: "Appearance" },
  { type: "select", name: "size", default: "medium", options: ["small", "medium", "large"], group: "Appearance" },
  { type: "select", name: "radius", default: "md", options: ["none", "sm", "md", "lg"], group: "Appearance" },
  { type: "text", name: "width", default: "300px", group: "Appearance" },
  { type: "boolean", name: "block", default: false, group: "Appearance" },
  { type: "text", name: "error", default: "", group: "Validation", placeholder: "no error", hint: "Marks the field invalid" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "loading", default: false, group: "State" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function TextInputDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = useState("");
  const log = useLog();
  return (
    <TextInput
      label={String(v.label) || undefined}
      placeholder={String(v.placeholder) || undefined}
      variant={v.variant as "outline"}
      size={v.size as "medium"}
      radius={v.radius as "md"}
      textType={v.textType as "text"}
      iconLeft={icon(v.iconLeft)}
      iconRight={icon(v.iconRight)}
      helperText={String(v.helperText) || undefined}
      error={String(v.error) || undefined}
      width={String(v.width)}
      block={Boolean(v.block)}
      maxLength={Number(v.maxLength) || undefined}
      required={Boolean(v.required)}
      loading={Boolean(v.loading)}
      disabled={Boolean(v.disabled)}
      value={value}
      setResult={(next) => {
        setValue(next);
        log("setResult", next);
      }}
      onBlur={() => log("onBlur")}
    />
  );
}

function PresetsDemo() {
  const [values, setValues] = useState<Record<string, string>>({});
  const log = useLog();
  const set = (k: string) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    log(`${k}.setResult`, v);
  };
  return (
    <div className="pg-form">
      <EmailInput label="Email" value={values.email ?? ""} setResult={set("email")} width="100%" />
      <PasswordInput label="Password" value={values.password ?? ""} setResult={set("password")} width="100%" helperText="At least 8 characters" />
      <MobileInput label="Mobile" value={values.mobile ?? ""} setResult={set("mobile")} helperText="Only digits and + are kept" width="100%" />
      <NumberInput label="Quantity" value={values.qty ?? ""} setResult={set("qty")} width="100%" />
      <UrlInput label="Website" setResult={set("url")} faviconResolver={googleFaviconResolver} helperText="Favicon lookup is opt-in" width="100%" />
    </div>
  );
}

const textAreaControls: Control[] = [
  { type: "text", name: "label", default: "Description", group: "Content" },
  { type: "text", name: "placeholder", default: "Tell us about the project…", group: "Content" },
  { type: "text", name: "helperText", default: "Markdown is not supported", group: "Content" },
  { type: "number", name: "minRows", default: 3, min: 1, max: 10, group: "Appearance" },
  { type: "number", name: "maxTextAreaHeight", default: 200, min: 80, max: 400, step: 20, group: "Appearance", hint: "Auto-grow limit (px)" },
  { type: "text", name: "width", default: "360px", group: "Appearance" },
  { type: "boolean", name: "resizable", default: false, group: "Appearance" },
  { type: "number", name: "maxLength", default: 200, min: 10, max: 500, step: 10, group: "Validation", libDefault: null },
  { type: "number", name: "minLength", default: 0, min: 0, max: 50, group: "Validation" },
  { type: "text", name: "error", default: "", group: "Validation", placeholder: "no error" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
  { type: "boolean", name: "showCharacterCount", default: true, group: "Counters", libDefault: false },
  { type: "boolean", name: "showWordCount", default: false, group: "Counters" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function TextAreaDemo({ v }: { v: ControlValues }) {
  const [text, setText] = useState("");
  const log = useLog();
  return (
    <TextArea
      label={String(v.label)}
      placeholder={String(v.placeholder)}
      helperText={String(v.helperText) || undefined}
      error={String(v.error) || undefined}
      minRows={Number(v.minRows)}
      maxTextAreaHeight={Number(v.maxTextAreaHeight)}
      resizable={Boolean(v.resizable)}
      maxLength={Number(v.maxLength)}
      minLength={Number(v.minLength) || undefined}
      showCharacterCount={Boolean(v.showCharacterCount)}
      showWordCount={Boolean(v.showWordCount)}
      required={Boolean(v.required)}
      disabled={Boolean(v.disabled)}
      width={String(v.width)}
      value={text}
      onValueChange={(next) => log("onValueChange", next)}
      setResult={(next) => {
        setText(next);
        log("setResult (blur)", next);
      }}
      setIsFieldValid={(valid) => log("setIsFieldValid", valid)}
    />
  );
}

const jsonControls: Control[] = [
  { type: "text", name: "label", default: "Payload", group: "Content" },
  { type: "text", name: "saveLabel", default: "Validate & Save", libDefault: "Validate & Save", group: "Content" },
  { type: "number", name: "indent", default: 2, min: 0, max: 8, group: "Behavior" },
  { type: "boolean", name: "hideOnSave", default: false, group: "Behavior" },
  { type: "boolean", name: "showCharacterCount", default: true, group: "Behavior", libDefault: false },
  { type: "text", name: "width", default: "380px", group: "Appearance" },
  { type: "boolean", name: "required", default: false, group: "Validation" },
];

function JsonDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <JsonField
      key={String(v.hideOnSave)}
      label={String(v.label)}
      saveLabel={String(v.saveLabel)}
      indent={Number(v.indent)}
      hideOnSave={Boolean(v.hideOnSave)}
      showCharacterCount={Boolean(v.showCharacterCount)}
      required={Boolean(v.required)}
      value={'{"name":"irt","tags":["ui"]}'}
      setResult={(json) => log("setResult", json)}
      setIsFieldValid={(valid) => log("setIsFieldValid", valid)}
      width={String(v.width)}
    />
  );
}

const addressControls: Control[] = [
  { type: "boolean", name: "isHouse", default: true, group: "Fields", libDefault: false },
  { type: "boolean", name: "isStreet", default: true, group: "Fields", libDefault: false },
  { type: "boolean", name: "isLandmark", default: false, group: "Fields" },
  { type: "boolean", name: "isCity", default: true, group: "Fields", libDefault: false },
  { type: "boolean", name: "isState", default: true, group: "Fields", libDefault: false },
  { type: "boolean", name: "isPostal", default: true, group: "Fields", libDefault: false },
  { type: "boolean", name: "isCountry", default: true, group: "Fields", libDefault: false },
  { type: "boolean", name: "isAddressLine", default: false, group: "Fields" },
  { type: "select", name: "columns", default: "2", options: ["1", "2"], group: "Layout" },
  { type: "text", name: "width", default: "440px", group: "Layout" },
  { type: "text", name: "legend", default: "Shipping address", group: "Content" },
  { type: "boolean", name: "requireCity", label: "requiredFields: city", default: true, group: "Validation" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function AddressDemo({ v }: { v: ControlValues }) {
  const [address, setAddress] = useState<AddressValue>({});
  const log = useLog();
  return (
    <AddressInput
      isHouse={Boolean(v.isHouse)}
      isStreet={Boolean(v.isStreet)}
      isLandmark={Boolean(v.isLandmark)}
      isCity={Boolean(v.isCity)}
      isState={Boolean(v.isState)}
      isPostal={Boolean(v.isPostal)}
      isCountry={Boolean(v.isCountry)}
      isAddressLine={Boolean(v.isAddressLine)}
      columns={Number(v.columns) as 1 | 2}
      legend={String(v.legend) || undefined}
      requiredFields={v.requireCity ? ["city"] : []}
      labels={{ postal: "PIN code" }}
      disabled={Boolean(v.disabled)}
      value={address}
      setResult={(next) => {
        setAddress(next);
        log("setResult", next);
      }}
      width={String(v.width)}
    />
  );
}

const otpControls: Control[] = [
  { type: "number", name: "length", default: 6, min: 4, max: 8, group: "Behavior" },
  { type: "boolean", name: "isNumeric", default: true, group: "Behavior" },
  { type: "boolean", name: "verify", label: "verify (demo)", default: true, group: "Behavior", hint: "The demo verifier accepts all 1s" },
  { type: "number", name: "resetDelay", default: 1500, libDefault: 3000, min: 500, max: 5000, step: 250, group: "Behavior" },
  { type: "text", name: "invalidMessage", default: "Invalid code, try again", group: "Content" },
  { type: "text", name: "width", default: "340px", group: "Appearance" },
  { type: "boolean", name: "disabled", default: false, group: "State" },
];

function OtpDemo({ v }: { v: ControlValues }) {
  const [error, setError] = useState("");
  const log = useLog();
  return (
    <div className="pg-stack pg-center">
      <OtpField
        key={`${v.length}-${v.verify}`}
        length={Number(v.length)}
        isNumeric={Boolean(v.isNumeric)}
        width={String(v.width)}
        disabled={Boolean(v.disabled)}
        invalidMessage={String(v.invalidMessage)}
        onComplete={(code) => log("onComplete", code)}
        setResult={(code) => log("setResult", code)}
        setError={(message) => {
          setError(message);
          if (message) log("setError", message);
        }}
        verify={v.verify ? async (code) => code === "1".repeat(Number(v.length)) : undefined}
        resetDelay={Number(v.resetDelay)}
      />
      {error && <ErrorMsg message={error} textAlign="center" padding="0" />}
    </div>
  );
}

const cities = ["Mumbai", "Mysuru", "Delhi", "Dehradun", "Pune", "Patna", "Bengaluru", "Bhopal", "Chennai", "Kolkata"].map((name, i) => ({
  code: i + 1,
  name,
}));

const searchControls: Control[] = [
  { type: "text", name: "placeholder", default: "Search a city…", group: "Content" },
  { type: "text", name: "emptyText", default: "No suggestions", libDefault: "No suggestions", group: "Content" },
  { type: "select", name: "variant", default: "outline", options: ["outline", "underline"], group: "Appearance" },
  { type: "text", name: "width", default: "300px", group: "Appearance" },
  { type: "number", name: "minChars", default: 2, libDefault: 3, min: 1, max: 4, group: "Behavior" },
  { type: "boolean", name: "clearable", default: true, group: "Behavior" },
];

function SearchDemo({ v }: { v: ControlValues }) {
  const log = useLog();
  return (
    <SearchBox
      suggestions={cities}
      variant={v.variant as "outline"}
      clearable={Boolean(v.clearable)}
      emptyText={String(v.emptyText)}
      width={String(v.width)}
      minChars={Number(v.minChars)}
      placeholder={String(v.placeholder)}
      onQueryChange={(q) => log("onQueryChange", q)}
      setResult={(code) => log("setResult", code)}
    />
  );
}

export const inputEntries: DocEntry[] = [
  {
    id: "text-input",
    title: "TextInput",
    group: "Inputs",
    description:
      "Text field with a floating label, icons, helper/error text, loading and a password toggle. Extends native input attributes; `setResult` receives the string value (your own `onChange` still runs). Heights follow `theme.layout.control.height`.",
    imports: 'import { TextInput } from "@itsrighttime/irt-ui";',
    controls: textControls,
    render: (v) => <TextInputDemo v={v} />,
    code: (v) =>
      jsx("TextInput", [
        ...changed(textControls, v),
        ["value", "{name}"],
        ["setResult", "{setName}"],
      ]),
    examples: [
      {
        title: "Variants",
        render: () => (
          <div className="pg-form">
            {(["outline", "filled", "ghost", "underline"] as const).map((variant) => (
              <TextInput key={variant} placeholder={variant} variant={variant} width="100%" />
            ))}
          </div>
        ),
        code: '<TextInput placeholder="outline" />\n<TextInput placeholder="filled" variant="filled" />\n<TextInput placeholder="ghost" variant="ghost" />\n<TextInput placeholder="underline" variant="underline" />',
      },
      {
        title: "Sizes",
        description: "Same heights as Button sizes, so rows of controls line up.",
        render: () => (
          <div className="pg-form">
            {(["small", "medium", "large"] as const).map((size) => (
              <TextInput key={size} placeholder={size} size={size} iconLeft="search" width="100%" />
            ))}
          </div>
        ),
        code: '<TextInput placeholder="small" size="small" iconLeft="search" />\n<TextInput placeholder="medium" iconLeft="search" />\n<TextInput placeholder="large" size="large" iconLeft="search" />',
      },
      {
        title: "Validation",
        render: () => (
          <div className="pg-form">
            <TextInput label="Email" value="ada@" error="Enter a valid email address" width="100%" iconLeft="mail" />
            <TextInput label="Username" value="ada" helperText="3–20 characters" width="100%" iconRight="check" />
          </div>
        ),
        code: '<TextInput label="Email" value={email} error="Enter a valid email address" iconLeft="mail" />\n<TextInput label="Username" value={name} helperText="3–20 characters" />',
      },
      {
        title: "States",
        render: () => (
          <div className="pg-form">
            <TextInput placeholder="Loading…" loading width="100%" />
            <TextInput placeholder="Disabled" disabled width="100%" />
          </div>
        ),
        code: '<TextInput placeholder="Loading…" loading />\n<TextInput placeholder="Disabled" disabled />',
      },
    ],
  },
  {
    id: "input-presets",
    title: "Input presets",
    group: "Inputs",
    description:
      "`EmailInput`, `PasswordInput`, `MobileInput`, `NumberInput` and `UrlInput` are TextInput presets with the right type, keyboard (`inputMode`) and `autoComplete`. They accept every TextInput prop.",
    imports: 'import { EmailInput, PasswordInput, MobileInput, NumberInput, UrlInput } from "@itsrighttime/irt-ui";',
    components: ["EmailInput", "PasswordInput", "MobileInput", "NumberInput", "UrlInput"],
    align: "stretch",
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
    description:
      "Auto-growing textarea with min/max length validation, character/word counters and helper/error text. `onValueChange` fires on every keystroke; `setResult` fires on blur.",
    imports: 'import { TextArea } from "@itsrighttime/irt-ui";',
    controls: textAreaControls,
    render: (v) => <TextAreaDemo v={v} />,
    code: (v) => jsx("TextArea", [...changed(textAreaControls, v), ["value", "{text}"], ["setResult", "{setText}"]]),
  },
  {
    id: "json-field",
    title: "JsonField",
    group: "Inputs",
    description: "JSON editor in a monospace TextArea. The save button pretty-prints valid JSON, reports the parser's error message otherwise, and calls `setIsFieldValid`.",
    imports: 'import { JsonField } from "@itsrighttime/irt-ui";',
    controls: jsonControls,
    render: (v) => <JsonDemo v={v} />,
    code: (v) => jsx("JsonField", [...changed(jsonControls, v), ["value", "{json}"], ["setResult", "{setJson}"], ["setIsFieldValid", "{setValid}"]]),
  },
  {
    id: "address-input",
    title: "AddressInput",
    group: "Inputs",
    description:
      "Composite address `<fieldset>`. Enable fields with the `is*` flags; `columns={2}` puts city/state and postal/country side by side. Fields get proper `autoComplete` tokens; `labels`, `requiredFields` and `errors` customise them.",
    imports: 'import { AddressInput, type AddressValue } from "@itsrighttime/irt-ui";',
    controls: addressControls,
    render: (v) => <AddressDemo v={v} />,
    code: (v) =>
      jsx("AddressInput", [
        ...changed(addressControls, v, ["isHouse", "isStreet", "isLandmark", "isCity", "isState", "isPostal", "isCountry", "isAddressLine", "width", "legend", "disabled"]),
        ["columns", v.columns === "2" ? 2 : undefined],
        ["requiredFields", v.requireCity ? '{["city"]}' : undefined],
        ["labels", '{{ postal: "PIN code" }}'],
        ["value", "{address}"],
        ["setResult", "{setAddress}"],
      ]),
  },
  {
    id: "otp-field",
    title: "OtpField",
    group: "Inputs",
    description:
      "One-time-code input with paste support and auto-advance. Pass `verify` (e.g. your API call) to validate; without it the completed code is emitted. Show `setError` messages with `ErrorMsg`.",
    imports: 'import { OtpField } from "@itsrighttime/irt-ui";',
    controls: otpControls,
    render: (v) => <OtpDemo v={v} />,
    code: (v) =>
      jsx("OtpField", [
        ["length", v.length === 6 ? undefined : v.length],
        ["isNumeric", v.isNumeric ? undefined : false],
        ["verify", v.verify ? "{(code) => api.verifyOtp(userId, code)}" : undefined],
        ...changed(otpControls, v, ["resetDelay", "invalidMessage", "width", "disabled"]),
        ["setResult", "{onVerified}"],
        ["setError", "{setError}"],
      ]),
  },
  {
    id: "search-box",
    title: "SearchBox",
    group: "Inputs",
    description:
      "Autocomplete over `{ code, name }` suggestions (ARIA combobox: ↑/↓, Enter, Escape). Matches are highlighted; `onQueryChange` lets you fetch remote suggestions.",
    imports: 'import { SearchBox } from "@itsrighttime/irt-ui";',
    controls: searchControls,
    render: (v) => <SearchDemo v={v} />,
    code: (v) => jsx("SearchBox", [["suggestions", "{cities}"], ...changed(searchControls, v), ["setResult", "{setCityCode}"]]),
  },
];
