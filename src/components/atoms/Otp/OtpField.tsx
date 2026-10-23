"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import type { BaseProps } from "../../../types/base-props";
import { cssVars } from "../../../utils/cssVars";
import { cx } from "../../../utils/cx";
import styles from "./OtpField.module.css";

/** Result of an OTP verification. */
export type OtpVerifyResult = boolean | { success: boolean; message?: string };

export interface OtpFieldProps extends Pick<BaseProps, "color" | "width" | "disabled" | "className"> {
  /** Number of digits. @default 6 */
  length?: number;
  /**
   * Called with the code once it is complete and (if `verify` is given)
   * verified; called with `null` when verification fails.
   */
  setResult: (otp: string | null) => void;
  /**
   * Optional verifier (e.g. your API call). Return `true`/`{ success: true }`
   * to accept. Replaces the former `verificationEndpoint`/`userId` props, so
   * the field no longer performs network requests itself.
   */
  verify?: (otp: string) => OtpVerifyResult | Promise<OtpVerifyResult>;
  /** Called whenever all digits are filled, before verification. */
  onComplete?: (otp: string) => void;
  /** Receives error messages ("" clears). */
  setError?: (err: string) => void;
  /** Digits only. @default true */
  isNumeric?: boolean;
  /** @default "Invalid Code, Try Again!" */
  invalidMessage?: string;
  /** Delay before clearing a rejected code, in ms. @default 3000 */
  resetDelay?: number;
  /** Accessible group label. @default "One-time code" */
  ariaLabel?: string;
}

/** One-time-code input with paste support and pluggable verification. */
export function OtpField({
  length = 6,
  setResult,
  verify,
  onComplete,
  setError,
  color,
  width = "300px",
  disabled = false,
  className,
  isNumeric = true,
  invalidMessage = "Invalid Code, Try Again!",
  resetDelay = 3000,
  ariaLabel = "One-time code",
}: OtpFieldProps) {
  const [otp, setOtp] = useState<string[]>(() => Array<string>(length).fill(""));
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const callbacks = useRef({ setResult, verify, onComplete, setError });
  callbacks.current = { setResult, verify, onComplete, setError };

  const isValidChar = (char: string) => (isNumeric ? /^\d$/.test(char) : char.length === 1);
  const focusAt = (index: number) => inputRefs.current[index]?.focus();

  useEffect(() => {
    const code = otp.join("");
    if (code.length !== length) return;

    let cancelled = false;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const { verify: verifyFn, onComplete: complete, setResult: emit, setError: reportError } = callbacks.current;
    complete?.(code);

    if (!verifyFn) {
      emit(code);
      return;
    }

    const reject = (message: string) => {
      setInvalid(true);
      reportError?.(message);
      emit(null);
      resetTimer = setTimeout(() => {
        setOtp(Array<string>(length).fill(""));
        setInvalid(false);
        reportError?.("");
        focusAt(0);
      }, resetDelay);
    };

    setBusy(true);
    Promise.resolve()
      .then(() => verifyFn(code))
      .then((result) => {
        if (cancelled) return;
        const ok = typeof result === "boolean" ? result : result.success;
        if (ok) emit(code);
        else reject((typeof result === "object" && result.message) || invalidMessage);
      })
      .catch(() => {
        if (!cancelled) reject("Verification failed");
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });

    return () => {
      cancelled = true;
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [otp, length, invalidMessage, resetDelay]);

  const handleChange = (index: number, raw: string) => {
    const char = raw.slice(-1);
    if (!isValidChar(char)) return;
    setOtp((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (index < length - 1) focusAt(index + 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const chars = event.clipboardData.getData("text").split("").filter(isValidChar).slice(0, length);
    if (chars.length === length) {
      setOtp(chars);
      focusAt(length - 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      setOtp((prev) => {
        const next = [...prev];
        if (prev[index]) next[index] = "";
        else if (index > 0) next[index - 1] = "";
        return next;
      });
      if (!otp[index] && index > 0) focusAt(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (event.key === "ArrowRight" && index < length - 1) {
      focusAt(index + 1);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      className={cx(styles.otpInputContainer, className)}
      style={cssVars({ "--irt-c-color": color ?? "var(--irt-color-primary)", "--irt-c-width": width })}
    >
      {otp.map((char, index) => (
        <input
          key={index}
          type="text"
          value={char}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className={cx(styles.otpInput, invalid && styles.colorError, char !== "" && styles.filled)}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onFocus={(event) => event.target.select()}
          onPaste={handlePaste}
          inputMode={isNumeric ? "numeric" : "text"}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          disabled={disabled || busy}
        />
      ))}
    </div>
  );
}
