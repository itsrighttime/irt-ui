export type KebabCaseFormat = "capitalized" | "lower" | "upper" | "title";

/**
 * Converts `kebab-case` (or `snake_case`) to space separated words.
 * `"user-profile"` → `"User profile"` (capitalized) / `"User Profile"` (title).
 */
export function fromKebabCase(value: string, format: KebabCaseFormat = "capitalized"): string {
  const words = value.split(/[-_]+/).filter(Boolean);
  const sentence = words.join(" ");
  switch (format) {
    case "lower":
      return sentence.toLowerCase();
    case "upper":
      return sentence.toUpperCase();
    case "title":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    case "capitalized":
    default:
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
}
