"use client";

import { TextInput } from "./TextInput";

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
};

/** Composite address form; enable fields with the `is*` flags. */
export function AddressInput({
  value = {},
  setResult,
  width = "300px",

  isHouse = false,
  isStreet = false,
  isCity = false,
  isState = false,
  isPostal = false,
  isCountry = false,
  isAddressLine = false,
  isLandmark = false,

  disabled,
  loading,
}: AddressInputProps) {
  const updateField = (key: keyof AddressValue, val: string) => {
    const updated = { ...value, [key]: val };
    setResult?.(updated);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--irt-space-sm)",
        width,
      }}
    >
      {isHouse && (
        <TextInput
          label="House / Flat No."
          value={value.house || ""}
          setResult={(val) => updateField("house", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isStreet && (
        <TextInput
          label="Street"
          value={value.street || ""}
          setResult={(val) => updateField("street", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isLandmark && (
        <TextInput
          label="Landmark"
          value={value.landmark || ""}
          setResult={(val) => updateField("landmark", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isCity && (
        <TextInput
          label="City"
          value={value.city || ""}
          setResult={(val) => updateField("city", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isState && (
        <TextInput
          label="State"
          value={value.state || ""}
          setResult={(val) => updateField("state", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isPostal && (
        <TextInput
          label="Postal Code"
          textType="number"
          value={value.postal || ""}
          setResult={(val) => updateField("postal", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isCountry && (
        <TextInput
          label="Country"
          value={value.country || ""}
          setResult={(val) => updateField("country", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}

      {isAddressLine && (
        <TextInput
          label="Address Line"
          value={value.addressLine || ""}
          setResult={(val) => updateField("addressLine", val)}
          disabled={disabled}
          loading={loading}
          width="100%"
        />
      )}
    </div>
  );
}
