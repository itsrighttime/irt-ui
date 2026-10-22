import { Slider, Switch, Tabs, TextArea, TextInput, SingleDropdown } from "@itsrighttime/irt-ui/atoms";
import type { Control, ControlValue, ControlValues } from "../docs/types";
import { ColorField } from "./ColorField";

export interface ControlsProps {
  controls: Control[];
  values: ControlValues;
  onChange: (name: string, value: ControlValue) => void;
}

const isSegmentable = (options: readonly string[]) => options.length <= 4 && options.every((o) => o.length <= 9);

function ControlField({ control, value, onChange }: { control: Control; value: ControlValue; onChange: (value: ControlValue) => void }) {
  const label = control.label ?? control.name;
  switch (control.type) {
    case "boolean":
      return <Switch label={label} value={Boolean(value)} setResult={onChange} width="100%" size="small" spread />;
    case "text":
      if (control.multiline) {
        return (
          <TextArea
            value={String(value)}
            placeholder={control.placeholder ?? ""}
            minRows={8}
            maxTextAreaHeight={360}
            resizable
            width="100%"
            onValueChange={onChange}
            setResult={onChange}
            className="pg-code-input"
            ariaLabel={control.label ?? control.name}
          />
        );
      }
      return (
        <TextInput
          ariaLabel={label}
          value={String(value)}
          placeholder={control.placeholder ?? "—"}
          setResult={onChange}
          width="100%"
          size="small"
        />
      );
    case "number":
      return (
        <Slider
          value={Number(value)}
          min={control.min ?? 0}
          max={control.max ?? 100}
          step={control.step ?? 1}
          showRange={false}
          showButtons={false}
          showValueSide="right"
          setResult={onChange}
          width="100%"
        />
      );
    case "select":
      return isSegmentable(control.options) ? (
        <Tabs
          variant="enclosed"
          size="small"
          fitted
          ariaLabel={label}
          value={String(value)}
          onChange={onChange}
          items={control.options.map((option) => ({ key: option, label: option }))}
        />
      ) : (
        <SingleDropdown
          options={[...control.options]}
          value={String(value)}
          placeholder={label}
          ariaLabel={label}
          floatingLabel={false}
          size="small"
          searchable={control.options.length > 8}
          setResult={(v) => v && onChange(v)}
          width="100%"
        />
      );
    case "color":
      return <ColorField label={label} value={String(value)} onChange={onChange} hideLabel />;
    default:
      return null;
  }
}

/** Grouped knobs panel (built with the library's own components). */
export function Controls({ controls, values, onChange }: ControlsProps) {
  const groups = new Map<string, Control[]>();
  for (const control of controls) {
    const group = control.group ?? "Props";
    groups.set(group, [...(groups.get(group) ?? []), control]);
  }
  return (
    <div className="pg-controls">
      {[...groups.entries()].map(([group, list]) => (
        <fieldset key={group} className="pg-control-group">
          <legend>{group}</legend>
          {list.map((control) => {
            const value = values[control.name] ?? control.default;
            const changed = value !== control.default;
            return (
              <div key={control.name} className="pg-control" data-changed={changed || undefined}>
                {control.type !== "boolean" && (
                  <span className="pg-control-label">
                    <code>{control.label ?? control.name}</code>
                    {changed && <span className="pg-changed-dot" title="Changed from default" />}
                  </span>
                )}
                <ControlField control={control} value={value} onChange={(v) => onChange(control.name, v)} />
                {control.hint && <span className="pg-control-hint">{control.hint}</span>}
              </div>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
