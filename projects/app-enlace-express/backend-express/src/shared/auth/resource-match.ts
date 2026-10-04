export function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0].split("#")[0];
  const singleSlashes = withoutQuery.replace(/\/{2,}/g, "/");
  const trimmed = singleSlashes.replace(/\/+$/, "");
  return trimmed || "/";
}

export function pathMatches(pattern: string, path: string): boolean {
  const patternParts = normalizePath(pattern).split("/");
  const pathParts = normalizePath(path).split("/");

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((segment, index) => {
    if (segment.startsWith(":") && segment.length > 1) {
      return pathParts[index].length > 0;
    }
    return segment === pathParts[index];
  });
}

export function isOperationGranted(
  granted: ReadonlyArray<{ method: string; path: string }>,
  method: string,
  path: string
): boolean {
  const normalizedMethod = method.trim().toUpperCase();
  return granted.some(
    (resource) =>
      resource.method.trim().toUpperCase() === normalizedMethod &&
      pathMatches(resource.path, path)
  );
}
