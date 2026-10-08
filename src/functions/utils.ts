export const lstrip = (str: string, trim: string): string => {
  while (str.startsWith(trim)) {
    str = str.substring(trim.length);
  }
  return str;
};

export const rstrip = (str: string, trim: string): string => {
  while (str.endsWith(trim)) {
    str = str.substring(0, str.length - trim.length);
  }
  return str;
};

export const strip = (str: string, trim: string): string => {
  return lstrip(rstrip(str, trim), trim);
};

export const toHumanReadableSize = (size: number): string => {
  if (size === 0) {
    return '0 B';
  }
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'];
  let unitIndex = 0;
  while (size >= 1024) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/** Encode raw S3 keys while preserving their directory separators. */
export const encodePath = (path: string): string =>
  path.split('/').map(encodeURIComponent).join('/');
