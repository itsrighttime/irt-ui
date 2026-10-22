import { useId } from "react";

export interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  /** Keep the label for assistive tech only (the controls panel shows its own label). */
  hideLabel?: boolean;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Native colour picker + hex text input. */
export function ColorField({ label, value, onChange, hint, hideLabel = false }: ColorFieldProps) {
  const id = useId();
  const safe = HEX.test(value) ? (value.length === 4 ? `#${[...value.slice(1)].map((c) => c + c).join("")}` : value) : "#000000";
  return (
    <div className="pg-color">
      <label htmlFor={id} title={hint} className={hideLabel ? "irt-visually-hidden" : undefined}>
        {label}
      </label>
      <div className="pg-color-row">
        <input id={id} type="color" value={safe} onChange={(e) => onChange(e.target.value)} aria-label={`${label} colour`} />
        <input
          type="text"
          value={value}
          spellCheck={false}
          aria-label={`${label} value`}
          placeholder="theme default"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
