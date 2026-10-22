/**
 * Joins `options` with ", " and truncates with "..." so the text fits in
 * `containerWidth` px using the font of `container`. Browser-only.
 */
export function getFittedText(options: string[], containerWidth: number, container: HTMLElement | null): string {
  if (!options.length || !container || typeof document === "undefined") return options.join(", ");

  const probe = document.createElement("span");
  probe.style.visibility = "hidden";
  probe.style.whiteSpace = "nowrap";
  probe.style.position = "absolute";
  probe.style.font = window.getComputedStyle(container).font;
  document.body.appendChild(probe);

  let result = "";
  for (const option of options) {
    const next = result ? `${result}, ${option}` : option;
    probe.textContent = next;
    if (probe.offsetWidth > containerWidth) {
      result = result ? `${result}...` : `${option.slice(0, 1)}...`;
      break;
    }
    result = next;
  }

  document.body.removeChild(probe);
  return result;
}
