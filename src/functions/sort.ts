import type { Entry } from './s3.ts';

export type SortField = 'name' | 'namedirfirst' | 'size' | 'time';
export type SortOrder = 'asc' | 'desc';
export type LayoutType = 'list' | 'grid';

export interface ViewParams {
  layout: LayoutType;
  sort: SortField;
  order: SortOrder;
  filter: string;
  limit: number;
  offset: number;
  query: string;
}

const parseCount = (value: string | null): number => {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 0;
};

export const parseViewParams = (url: URL): ViewParams => {
  const layout = url.searchParams.get('layout');
  const sort = url.searchParams.get('sort');
  const order = url.searchParams.get('order');

  return {
    layout: layout === 'grid' ? 'grid' : 'list',
    sort: ['name', 'namedirfirst', 'size', 'time'].includes(sort || '')
      ? (sort as SortField)
      : 'namedirfirst',
    order: order === 'desc' ? 'desc' : 'asc',
    filter: url.searchParams.get('filter') || '',
    limit: parseCount(url.searchParams.get('limit')),
    offset: parseCount(url.searchParams.get('offset')),
    query: url.search,
  };
};

export const buildSortUrl = (
  basePath: string,
  currentParams: ViewParams,
  newSort?: SortField,
  newOrder?: SortOrder,
  newLayout?: LayoutType,
): string => {
  const params = new URLSearchParams(currentParams.query);

  const layout = newLayout ?? currentParams.layout;
  const sort = newSort ?? currentParams.sort;
  let order = newOrder ?? currentParams.order;

  // If clicking the same sort field, toggle order
  if (newSort && newSort === currentParams.sort && !newOrder) {
    order = currentParams.order === 'asc' ? 'desc' : 'asc';
  }

  params.set('layout', layout);
  params.set('sort', sort);
  params.set('order', order);

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const sortEntries = (
  entries: Entry[],
  sort: SortField,
  order: SortOrder,
): Entry[] => {
  const directories = entries.filter((e) => e.type === 'directory');
  const files = entries.filter((e) => e.type === 'file');

  const compareFunc = (a: Entry, b: Entry): number => {
    let result = 0;

    switch (sort) {
      case 'namedirfirst':
      case 'name': {
        result = a.name.localeCompare(b.name, 'en', {
          numeric: true,
          sensitivity: 'base',
        });
        break;
      }
      case 'size': {
        const sizeA = a.type === 'file' ? a.size : -1;
        const sizeB = b.type === 'file' ? b.size : -1;
        result = sizeA - sizeB;
        break;
      }
      case 'time': {
        const timeA = a.lastModified?.getTime() ?? 0;
        const timeB = b.lastModified?.getTime() ?? 0;
        result = timeA - timeB;
        break;
      }
    }

    return order === 'desc' ? -result : result;
  };

  if (sort === 'name') return [...entries].sort(compareFunc);

  // Preserve directory-first ordering for size and time as well.
  return [
    ...directories.sort(compareFunc),
    ...files.sort(compareFunc),
  ];
};

export interface EntryPage {
  entries: Entry[];
  offset: number;
  total: number;
}

export const paginateEntries = (
  entries: Entry[],
  params: ViewParams,
): EntryPage => {
  const offset = params.offset;
  return {
    entries: params.limit
      ? entries.slice(offset, offset + params.limit)
      : entries.slice(offset),
    offset,
    total: entries.length,
  };
};
