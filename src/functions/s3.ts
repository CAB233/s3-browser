import { S3mini } from 's3mini';
import {
  concatArrays,
  lstrip,
  parseDate,
  rstrip,
  strip,
  toHumanReadableSize,
} from './utils.ts';
import {
  BUCKET_ACCESS_KEY_ID,
  BUCKET_DOWNLOAD_URL,
  BUCKET_ENDPOINT,
  BUCKET_NAME,
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

export type FSListing = {
  entries: Entry[];
  numDirectories: number;
  numFiles: number;
  numTotal: string;
};

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
    });
  }
  return s3Client;
};

const sortAndGetListing = (entries: Entry[]): FSListing => {
  const directories = entries
    .filter((entry) => entry.type === 'directory')
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  const files = entries
    .filter((entry) => entry.type === 'file')
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
  return {
    entries: concatArrays<Entry>(directories, files),
    numDirectories: directories.length,
    numFiles: files.length,
    numTotal: toHumanReadableSize(totalSize),
  };
};

interface S3Object {
  Key: string;
  Size: number;
  LastModified: Date;
  ETag: string;
  StorageClass: string;
}

const objectListToFS = (
  objects: S3Object[],
  currentPath: string,
): FSListing => {
  const dlUrl = BUCKET_DOWNLOAD_URL;
  const strippedKeyObjects = objects
    .filter((obj) => !!obj.Key)
    .map((obj) => {
      return {
        ...obj,
        Key: '/' + lstrip(obj.Key || '', '/'),
      };
    })
    .filter((obj) => obj.Key?.startsWith(currentPath))
    .map((obj) => {
      return {
        ...obj,
        ShortKey: obj.Key?.substring(currentPath.length) || '',
      };
    });

  const entries = strippedKeyObjects.map((obj): Entry => {
    if (obj.ShortKey?.includes('/')) {
      return {
        type: 'directory',
        anchor: obj.ShortKey.split('/')[0] + '/',
        name: obj.ShortKey.split('/')[0],
      };
    } else {
      // Ensure size is converted to a number to prevent "toFixed is not a function" error
      const size = typeof obj.Size === 'number'
        ? obj.Size
        : parseInt(obj.Size) || 0;

      return {
        type: 'file',
        anchor: rstrip(dlUrl, '/') + '/' + lstrip(obj.Key || '', '/'),
        name: obj.ShortKey,
        fullPath: obj.Key || '',
        lastModified: parseDate(obj.LastModified),
        size: size,
        humanReadableSize: toHumanReadableSize(size),
        extension: getExtension(obj.ShortKey),
      };
    }
  });
  const unsortedEntries = entries.filter((entry, index, self) => {
    return (
      index ===
        self.findIndex((t) => t.type === entry.type && t.name === entry.name)
    );
  });
  return sortAndGetListing(unsortedEntries);
};

export const listAllObjects = async (
  bucketName: string,
): Promise<S3Object[]> => {
  const client = getS3Client();
  const allObjects: S3Object[] = [];

  try {
    let token: string | undefined;
    do {
      const response = await client.listObjectsPaged(bucketName, token);
      if (response?.objects) {
        allObjects.push(...response.objects);
      }
      token = response?.nextContinuationToken;
    } while (token);
  } catch (e) {
    console.error('Error listing objects:', e);
    throw e;
  }

  return allObjects;
};

export const listBucket = async (
  path: string,
): Promise<FSListing> => {
  const normalizedPathT = '/' + strip(path, '/') + '/';
  const normalizedPath = normalizedPathT === '//' ? '/' : normalizedPathT;

  console.log(`Fetching bucket list for ${BUCKET_NAME} at ${new Date()}`);
  const allObjects = await listAllObjects(BUCKET_NAME);
  return objectListToFS(allObjects, normalizedPath);
};
