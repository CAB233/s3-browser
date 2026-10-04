import { strip } from './utils.ts';

export const shouldBypassCache = (path: string, prefixes: string): boolean => {
  const normalizedPath = '/' + strip(path, '/');

  return prefixes.split(',').some((prefix) => {
    const trimmedPrefix = prefix.trim();
    if (!trimmedPrefix) {
      return false;
    }

    const normalizedPrefix = '/' + strip(trimmedPrefix, '/');
    return (
      normalizedPrefix === '/' ||
      normalizedPath === normalizedPrefix ||
      normalizedPath.startsWith(normalizedPrefix + '/')
    );
  });
};
