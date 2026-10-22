import { useEffect, useLayoutEffect } from "react";
import { canUseDOM } from "../utils/dom";

/** `useLayoutEffect` in the browser, `useEffect` on the server (no SSR warning). */
export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
