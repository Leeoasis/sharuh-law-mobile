const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const extensionForType = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const sanitizeUploadName = (name = 'document.pdf', mimeType = 'application/pdf') => {
  const clean = String(name)
    .replace(/[\r\n]/g, '')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
  const extension = extensionForType[mimeType] || 'pdf';
  const fallback = `document.${extension}`;
  const safeName = clean || fallback;
  return /\.[a-z0-9]{2,5}$/i.test(safeName) ? safeName : `${safeName}.${extension}`;
};

export const normalizeMimeType = (mimeType) => (
  ALLOWED_MIME_TYPES.has(mimeType) ? mimeType : 'application/pdf'
);

export const validateUploadAsset = (asset) => {
  if (!asset?.uri) return 'Choose a file to upload.';
  if (asset.size && asset.size > MAX_UPLOAD_BYTES) return 'Upload must be 10MB or smaller.';
  const mimeType = asset.mimeType || asset.type;
  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    return 'Upload a PDF, JPG, PNG, or WebP file.';
  }
  return null;
};

export const toSafeUploadAsset = (asset) => {
  const type = normalizeMimeType(asset?.mimeType || asset?.type);
  return {
    ...asset,
    type,
    mimeType: type,
    name: sanitizeUploadName(asset?.name, type),
  };
};
