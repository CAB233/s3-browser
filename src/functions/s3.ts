import { S3mini, S3NetworkError, S3ServiceError } from 's3mini';
import type { ListObject } from 's3mini';
import { lstrip, rstrip, strip, toHumanReadableSize } from './utils.ts';
import {
  BUCKET_ACCESS_KEY_ID,
  BUCKET_DOWNLOAD_URL,
  BUCKET_ENDPOINT,
  BUCKET_REGION,
  BUCKET_SECRET_ACCESS_KEY,
} from './env.ts';

export type Entry =
  | {
    type: 'directory';
    name: string;
    anchor: string;
    lastModified?: Date;
    size?: number;
    humanReadableSize?: string;
  }
  | {
    type: 'file';
    name: string;
    anchor: string;
    fullPath: string;
    lastModified: Date;
    size: number;
    humanReadableSize: string;
    extension: string;
  };

export interface FSListing {
  entries: Entry[];
  numDirectories: number;
  numFiles: number;
  numTotal: string;
}

const getExtension = (filename: string): string => {
  const parts = filename.split('.');
  if (parts.length === 1 || (filename.startsWith('.') && parts.length === 2)) {
    return '';
  }
  return parts[parts.length - 1];
};

let s3Client: S3mini | null = null;
const getS3Client = (): S3mini => {
  if (!s3Client) {
    s3Client = new S3mini({
      region: BUCKET_REGION,
      endpoint: BUCKET_ENDPOINT,
      accessKeyId: BUCKET_ACCESS_KEY_ID,
      secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
      requestAbortTimeout: 10_000,
    });
  }
  return s3Client;
};

const objectListToFS = (
  objects: ListObject[],
  currentPath: string,
): FSListing => {
  const downloadUrl = rstrip(BUCKET_DOWNLOAD_URL, '/') + '/';
  const entries: Entry[] = [];
  const seen = new Set<string>();
  let numDirectories = 0;
  let numFiles = 0;
  let totalSize = 0;

  for (const obj of objects) {
    const fullPath = '/' + lstrip(obj.Key, '/');
    if (!fullPath.startsWith(currentPath)) {
      continue;
    }

    const shortKey = fullPath.substring(currentPath.length);
    // A folder marker matching the current path has no child name.
    if (!shortKey) {
      continue;
    }

    const slashIndex = shortKey.indexOf('/');
    const isDirectory = slashIndex !== -1;
    const name = isDirectory ? shortKey.substring(0, slashIndex) : shortKey;
    const entryKey = (isDirectory ? 'directory:' : 'file:') + name;
    if (seen.has(entryKey)) {
      continue;
    }
    seen.add(entryKey);

    if (isDirectory) {
      entries.push({
        type: 'directory',
        anchor: name + '/',
        name,
      });
      numDirectories += 1;
    } else {
      entries.push({
        type: 'file',
        anchor: downloadUrl + lstrip(fullPath, '/'),
        name,
        fullPath,
        lastModified: obj.LastModified,
        size: obj.Size,
        humanReadableSize: toHumanReadableSize(obj.Size),
        extension: getExtension(name),
      });
      numFiles += 1;
      totalSize += obj.Size;
    }
  }

  return {
    entries,
    numDirectories,
    numFiles,
    numTotal: toHumanReadableSize(totalSize),
  };
};

const listDirectoryObjects = async (prefix: string): Promise<ListObject[]> => {
  const client = getS3Client();

  try {
    // The S3 grouping delimiter is passed in opts; listObjects handles paging.
    const objects = await client.listObjects('/', prefix, undefined, {
      delimiter: '/',
    });
    if (objects === null) {
      throw new S3ServiceError(
        'S3 bucket was not found. Check BUCKET_ENDPOINT.',
        404,
        'NoSuchBucket',
      );
    }
    return objects;
  } catch (err) {
    if (err instanceof S3ServiceError) {
      console.error(
        `S3 service error ${err.status}: ${err.serviceCode}`,
        err.body ?? err.message,
      );
    } else if (err instanceof S3NetworkError) {
      console.error(`S3 network error: ${err.code}`);
    } else {
      console.error('Unexpected error listing objects:', err);
    }
    throw err;
  }
};

export const listBucket = async (path: string): Promise<FSListing> => {
  const directory = strip(path, '/');
  const prefix = directory ? directory + '/' : '';
  const objects = await listDirectoryObjects(prefix);
  return objectListToFS(objects, '/' + prefix);
};
