import DOMPurify from 'dompurify';
export function sanitizeText(text, allowLink = false) {
  const configs = allowLink ? {
    ALLOWED_TAGS: ['a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false
  } : {};
  return DOMPurify.sanitize(text, configs);
}
export function sanitizeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];

    if (allowedProtocols.includes(parsedUrl.protocol)) {
      return parsedUrl.href;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export async function sanitizeImageFile(file: File): Promise<File> {
  if (file.type === 'image/svg+xml') {
    const svgContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    const cleanSVG = DOMPurify.sanitize(svgContent, { USE_PROFILES: { svg: true } });

    const blob = new Blob([cleanSVG], { type: 'image/svg+xml' });
    file = new File([blob], file.name, { type: 'image/svg+xml' });
  }
  return file;
}