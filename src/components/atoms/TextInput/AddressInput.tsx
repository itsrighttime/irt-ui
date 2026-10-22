"use client";

import { useId } from "react";
import { cx } from "../../../utils/cx";
import { TextInput } from "./TextInput";
import styles from "./TextInput.module.css";

export type AddressValue = {
  house?: string;
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  addressLine?: string;
  landmark?: string;
};

export type AddressField = keyof AddressValue;

export type AddressInputProps = {
  value?: AddressValue;
  width?: string;
  setResult?: (value: AddressValue) => void;

  isHouse?: boolean;
  isStreet?: boolean;
  isCity?: boolean;
  isState?: boolean;
  isPostal?: boolean;
  isCountry?: boolean;
  isAddressLine?: boolean;
  isLandmark?: boolean;

  disabled?: boolean;
  loading?: boolean;

  /** Lay out short fields (city/state, postal/country) side by side. @default 1 */
  columns?: 1 | 2;
  /** Override field labels, e.g. `{ postal: "ZIP code" }`. */
  labels?: Partial<Record<AddressField, string>>;
  /** Fields marked as required. */
  requiredFields?: AddressField[];
  /** Per-field error messages. */
  errors?: Partial<Record<AddressField, string>>;
  /** Group legend (rendered as a `<fieldset>` legend). */
  legend?: string;
  className?: string;
};

interface FieldSpec {
  key: AddressField;
  flag: keyof AddressInputProps;
  label: string;
  autoComplete: string;
  /** Spans both columns in the 2-column layout. */
  wide: boolean;
}

/** Field order and defaults (order preserved from the original component). */
const FIELDS: FieldSpec[] = [
  { key: "house", flag: "isHouse", label: "House / Flat No.", autoComplete: "address-line1", wide: true },
  { key: "street", flag: "isStreet", label: "Street", autoComplete: "address-line2", wide: true },
  { key: "landmark", flag: "isLandmark", label: "Landmark", autoComplete: "off", wide: true },
  { key: "city", flag: "isCity", label: "City", autoComplete: "address-level2", wide: false },
  { key: "state", flag: "isState", label: "State", autoComplete: "address-level1", wide: false },
  { key: "postal", flag: "isPostal", label: "Postal Code", autoComplete: "postal-code", wide: false },
  { key: "country", flag: "isCountry", label: "Country", autoComplete: "country-name", wide: false },
  { key: "addressLine", flag: "isAddressLine", label: "Address Line", autoComplete: "street-address", wide: true },
];

/** Composite address form; enable fields with the `is*` flags. */
export function AddressInput(props: AddressInputProps) {
  const {
    value = {},
    setResult,
    width = "300px",
    disabled,
    loading,
    columns = 1,
    labels = {},
    requiredFields = [],
    errors = {},
    legend,
    className,
  } = props;
  const legendId = useId();

  const updateField = (key: AddressField, val: string) => {
    setResult?.({ ...value, [key]: val });
  };

  const fields = FIELDS.filter((field) => props[field.flag] === true);

  return (
    <fieldset
      className={cx(styles.addressGroup, columns === 2 && styles.addressTwoColumns, className)}
      style={{ width }}
      aria-labelledby={legend ? legendId : undefined}
      disabled={disabled}
    >
      {legend && (
        <legend id={legendId} className={styles.addressLegend}>
          {legend}
        </legend>
      )}
      {fields.map((field) => (
        <div key={field.key} className={cx(styles.addressCell, field.wide && styles.addressWide)}>
          <TextInput
            label={labels[field.key] ?? field.label}
            value={value[field.key] ?? ""}
            setResult={(val) => updateField(field.key, val)}
            disabled={disabled}
            loading={loading}
            required={requiredFields.includes(field.key)}
            error={errors[field.key]}
            autoComplete={field.autoComplete}
            name={field.key}
            width="100%"
          />
        </div>
      ))}
    </fieldset>
  );
}
