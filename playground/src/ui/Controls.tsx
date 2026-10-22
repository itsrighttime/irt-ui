import { SingleDropdown, Slider, Switch, TextInput } from "@itsrighttime/irt-ui/atoms";
import type { Control, ControlValue, ControlValues } from "../docs/types";
import { ColorField } from "./ColorField";

export interface ControlsProps {
  controls: Control[];
  values: ControlValues;
  onChange: (name: string, value: ControlValue) => void;
}

/** Knobs panel (built with the library's own components). */
export function Controls({ controls, values, onChange }: ControlsProps) {
  return (
    <div className="pg-controls">
      {controls.map((control) => {
        const label = control.label ?? control.name;
        const value = values[control.name] ?? control.default;
        switch (control.type) {
          case "boolean":
            return (
              <div key={control.name} className="pg-control">
                <Switch label={label} value={Boolean(value)} setResult={(v) => onChange(control.name, v)} width="100%" />
              </div>
            );
          case "text":
            return (
              <div key={control.name} className="pg-control">
                <span className="pg-control-label">{label}</span>
                <TextInput ariaLabel={label} value={String(value)} setResult={(v) => onChange(control.name, v)} width="100%" size="small" />
              </div>
            );
          case "number":
            return (
              <div key={control.name} className="pg-control">
                <span className="pg-control-label">{label}</span>
                <Slider
                  value={Number(value)}
                  min={control.min ?? 0}
                  max={control.max ?? 100}
                  step={control.step ?? 1}
                  showRange={false}
                  showValueSide="right"
                  setResult={(v) => onChange(control.name, v)}
                  width="100%"
                />
              </div>
            );
          case "select":
            return (
              <div key={control.name} className="pg-control pg-control-select">
                <SingleDropdown
                  options={[...control.options]}
                  value={String(value)}
                  placeholder={label}
                  setResult={(v) => v && onChange(control.name, v)}
                  width="100%"
                />
              </div>
            );
          case "color":
            return (
              <div key={control.name} className="pg-control">
                <ColorField label={label} value={String(value)} onChange={(v) => onChange(control.name, v)} />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
