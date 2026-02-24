type MediaHint = {
  url?: string | null;
  contentType?: string | null;
};

const VIDEO_EXTENSION_REGEX = /\.(mp4|webm|mov|ogg)(?:$|\?)/i;

export function isLikelyVideoMedia({ url, contentType }: MediaHint) {
  if (contentType?.startsWith("video/")) return true;

  if (!url) return false;
  return VIDEO_EXTENSION_REGEX.test(url);
}
