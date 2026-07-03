/**
 * Cloudinary serves transformations via URL segments, so we don't need
 * a second stored copy per size — just rewrite the delivery URL.
 * Falls back to the original URL untouched if it's not a Cloudinary URL
 * (e.g. during local dev with placeholder images).
 */
export function cldTransform(
  url: string,
  opts: { width?: number; height?: number; quality?: "auto" | number } = {},
): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const { width, height, quality = "auto" } = opts;
  const parts = ["f_auto", `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`, "c_fill");

  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}

/** Presets for the sizes actually used across the app. */
export const cldThumb = (url: string) => cldTransform(url, { width: 400, height: 400 });
export const cldCard = (url: string) => cldTransform(url, { width: 600 });
export const cldAvatar = (url: string) => cldTransform(url, { width: 160, height: 160 });
export const cldFull = (url: string) => cldTransform(url, { width: 1400 });