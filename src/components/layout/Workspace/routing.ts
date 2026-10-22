const segments = (path: string) => path.split(/[?#]/)[0]?.split("/").filter(Boolean) ?? [];

/**
 * Whether `route` matches `currentPath` (prefix match by path segment).
 *
 * - Absolute routes (`"/workspace/documents"`) are matched from the root.
 *   A route that only names the base (`"/workspace"` or `"/workspace/"`, i.e.
 *   a "home" tab) matches exactly, so it is not active on every sub-page.
 * - Relative routes (`"user/list"`) are matched after `basePath`. When
 *   `basePath` is omitted the first segment is skipped, matching the
 *   original behaviour (`/workspace/user/list` ⇢ `user/list`).
 */
export function matchRoute(route: string | undefined, currentPath: string | undefined, basePath?: string): boolean {
  if (!route || currentPath === undefined) return false;
  const current = segments(currentPath);
  const target = segments(route);
  if (target.length === 0) return current.length === 0;

  const baseDepth = basePath === undefined ? 1 : segments(basePath).length;
  if (route.startsWith("/")) {
    if (target.length <= baseDepth) {
      return target.length === current.length && target.every((segment, i) => current[i] === segment);
    }
    return target.every((segment, i) => current[i] === segment);
  }
  return target.every((segment, index) => current[index + baseDepth] === segment);
}
