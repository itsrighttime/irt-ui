import { useId } from "react";

export interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Native colour picker + hex text input. */
export function ColorField({ label, value, onChange, hint }: ColorFieldProps) {
  const id = useId();
  const safe = HEX.test(value) ? (value.length === 4 ? `#${[...value.slice(1)].map((c) => c + c).join("")}` : value) : "#000000";
  return (
    <div className="pg-color">
      <label htmlFor={id} title={hint}>
        {label}
      </label>
      <div className="pg-color-row">
        <input id={id} type="color" value={safe} onChange={(e) => onChange(e.target.value)} aria-label={`${label} colour`} />
        <input
          type="text"
          value={value}
          spellCheck={false}
          aria-label={`${label} value`}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
