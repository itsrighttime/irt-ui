"use client";

import { forwardRef, useMemo, useState } from "react";
import { Icon } from "../../../icons/Icon";
import { useSyncedState } from "../../../hooks/useSyncedState";
import { TextInput } from "./TextInput";
import type { TextInputVariantProps } from "./TextInput.types";

/** Returns a favicon URL for a domain, or `null` for none. */
export type FaviconResolver = (domain: string) => string | null;

/**
 * Resolver matching the previous built-in behaviour (Google's favicon
 * service). Opt-in because it sends the typed domain to a third party.
 */
export const googleFaviconResolver: FaviconResolver = (domain) =>
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;

export interface UrlInputProps extends TextInputVariantProps {
  /** Show a favicon for valid URLs. No external request is made unless provided. */
  faviconResolver?: FaviconResolver;
  /** Message shown for invalid URLs. @default "Invalid URL" */
  invalidMessage?: string;
}

const normalizeUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

/** Returns the hostname of a (scheme-optional) URL, or `null` if invalid. */
export function parseUrlDomain(url: string): string | null {
  try {
    const { hostname } = new URL(normalizeUrl(url));
    return hostname.includes(".") ? hostname : null;
  } catch {
    return null;
  }
}

/** URL field with validation and optional favicon preview. */
export const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(function UrlInput(
  { setResult, value: valueProp, faviconResolver, invalidMessage = "Invalid URL", error: errorProp, placeholder, ...props },
  ref,
) {
  const [value, setValue] = useSyncedState(valueProp === undefined || valueProp === null ? "" : String(valueProp));
  const [faviconFailed, setFaviconFailed] = useState<string | null>(null);

  const domain = useMemo(() => (value ? parseUrlDomain(value) : null), [value]);
  const error = errorProp ?? (value && !domain ? invalidMessage : undefined);
  const favicon = domain && faviconResolver ? faviconResolver(domain) : null;

  let iconLeft = null;
  if (value) {
    iconLeft =
      favicon && faviconFailed !== favicon ? (
        <img
          src={favicon}
          alt=""
          style={{ width: 20, height: 20, objectFit: "contain" }}
          onError={() => setFaviconFailed(favicon)}
        />
      ) : (
        <Icon name="link" size="1.1em" />
      );
  }

  return (
    <TextInput
      ref={ref}
      inputMode="url"
      autoComplete="url"
      placeholder={placeholder ?? "Enter website URL"}
      {...props}
      textType="text"
      value={value}
      error={error}
      iconLeft={iconLeft}
      setResult={(next) => {
        setValue(next);
        setResult?.(next);
      }}
    />
  );
});
