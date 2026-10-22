"use client";

import { useId, type CSSProperties } from "react";
import { Icon } from "../../../icons/Icon";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import styles from "./SelectionBox.module.css";

export type SelectionValue = string | number;

export interface SelectionOption {
  value: SelectionValue;
  label: string;
  /** Helper text under the label. */
  help?: string;
  disabled?: boolean;
}

export interface SelectionCustomStyles {
  group?: CSSProperties;
  item?: CSSProperties;
  label?: CSSProperties;
}

export interface SelectionBoxProps {
  options: SelectionOption[];
  /** Selected values. */
  value?: SelectionValue[];
  /** Multiple: receives the new array. Single: receives the chosen value. */
  setResult: (value: SelectionValue[] | SelectionValue | null) => void;
  /** Checkbox (`true`) or radio (`false`) behaviour. @default true */
  multiple?: boolean;
  /** @default "vertical" */
  layout?: "vertical" | "horizontal";
  label?: string;
  color?: string;
  disabled?: boolean;
  customStyles?: SelectionCustomStyles;
  /** @default "300px" */
  width?: string;
  required?: boolean;
  /** Form field name (radio groups get a generated one by default). */
  name?: string;
}

/**
 * Checkbox / radio group rendered with native (visually hidden) inputs, so
 * it is keyboard accessible and works in forms. Used by `CheckboxGroup` and
 * `RadioGroup`.
 */
export function SelectionBox({
  options = [],
  value: selectedValues = [],
  setResult,
  multiple = true,
  layout = "vertical",
  label,
  color,
  disabled = false,
  customStyles = {},
  width = "300px",
  required = false,
  name,
}: SelectionBoxProps) {
  const groupId = useId();
  const labelId = `${groupId}-label`;
  const fieldName = name ?? groupId;

  const toggle = (optionValue: SelectionValue) => {
    if (multiple) {
      setResult(
        selectedValues.includes(optionValue)
          ? selectedValues.filter((item) => item !== optionValue)
          : [...selectedValues, optionValue],
      );
    } else {
      setResult(optionValue);
    }
  };

  return (
    <div
      className={cx(styles.selectionGroup, styles[layout])}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width }, customStyles.group)}
      role={multiple ? "group" : "radiogroup"}
      aria-labelledby={label ? labelId : undefined}
      aria-required={required || undefined}
    >
      {label && (
        <div id={labelId} className={styles.label}>
          {label}{" "}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </div>
      )}

      {options.map((option, index) => {
        const selected = selectedValues.includes(option.value);
        const isDisabled = disabled || Boolean(option.disabled);
        const helpId = option.help ? `${groupId}-help-${index}` : undefined;
        const iconName = multiple ? (selected ? "checkboxOn" : "checkboxOff") : selected ? "radioOn" : "radioOff";

        return (
          <div
            key={`${option.value}`}
            className={cx(styles.selectionItem, isDisabled && styles.disabled)}
            style={customStyles.item}
          >
            <label
              className={cx(styles.labelIcon, styles.selectionLabel, isDisabled && styles.disabled, selected && styles.selected)}
              style={customStyles.label}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                className="irt-visually-hidden"
                name={fieldName}
                value={String(option.value)}
                checked={selected}
                disabled={isDisabled}
                aria-describedby={helpId}
                onChange={() => toggle(option.value)}
              />
              <span
                className={styles.icon}
                aria-hidden="true"
                style={{ color: isDisabled ? "var(--irt-color-on-disabled)" : "var(--irt-c-color)" }}
              >
                <Icon name={iconName} size="1.25em" />
              </span>
              {option.label}
            </label>

            {option.help && (
              <div id={helpId} className={cx(styles.inlineHelp, isDisabled && styles.disabled, selected && styles.selected)}>
                {option.help}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
