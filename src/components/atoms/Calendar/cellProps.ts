import type { KeyboardEvent } from "react";

/** Props that make a grid cell keyboard-operable like a button. @internal */
export function cellProps(enabled: boolean, onActivate: () => void, selected: boolean, label: string, tabbable = true) {
  return {
    role: "button" as const,
    tabIndex: enabled && tabbable ? 0 : -1,
    "aria-disabled": enabled ? undefined : true,
    "aria-pressed": selected,
    "aria-label": label,
    onClick: enabled ? onActivate : undefined,
    onKeyDown: enabled
      ? (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onActivate();
          }
        }
      : undefined,
  };
}
