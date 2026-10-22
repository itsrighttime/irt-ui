"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

/** Shallow equality for arrays (by item identity); `Object.is` otherwise. */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => Object.is(item, b[i]));
  }
  return false;
}

/**
 * Local state initialised from `value` and re-synchronised whenever `value`
 * changes (compared with `isEqual`, shallow by default). Gives the "initial
 * value + setResult callback" components of this library both behaviours: a
 * static `value` acts as a default, while a parent that updates `value` stays
 * in control.
 */
export function useSyncedState<T>(
  value: T,
  isEqual: (a: T, b: T) => boolean = shallowEqual,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(value);
  const previous = useRef(value);
  useEffect(() => {
    if (!isEqual(previous.current, value)) {
      previous.current = value;
      setState(value);
    }
  }, [value, isEqual]);
  return [state, setState];
}
