const RENDERABLE_IMAGE_PREFIXES = ["https://", "http://", "data:", "blob:"];

/**
 * Storage object keys (for example profiles/5/avatar/file.jpg) are not URLs.
 * Rendering them directly makes the browser request the current FE origin.
 */
export const getRenderableImageUrl = (value) => {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim();
  if (!normalized) return undefined;

  const lowerValue = normalized.toLowerCase();
  return RENDERABLE_IMAGE_PREFIXES.some((prefix) => lowerValue.startsWith(prefix))
    ? normalized
    : undefined;
};
