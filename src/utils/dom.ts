/** True when running in a browser (safe for SSR guards). */
export const canUseDOM: boolean =
  typeof window !== "undefined" && typeof document !== "undefined";
