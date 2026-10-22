"use client";

import { useCallback, useRef, useState } from "react";

export interface UseControllableStateOptions<T> {
  /** Controlled value. When `undefined` the hook manages state internally. */
  value?: T;
  /** Initial value for uncontrolled usage. */
  defaultValue: T;
  /** Called on every change (both modes). */
  onChange?: (value: T) => void;
}

/**
 * Supports both controlled (`value` + `onChange`) and uncontrolled usage.
 * Returns `[value, setValue]`.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
