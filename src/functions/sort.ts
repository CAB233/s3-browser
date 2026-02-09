import type { Entry } from './s3.ts';
import Up from '../icons/up-arrow.svg?raw';
import Down from '../icons/down-arrow.svg?raw';

export type SortField = 'name' | 'size' | 'time';
export type SortOrder = 'asc' | 'desc';
export type LayoutType = 'list' | 'grid';

export interface ViewParams {
  layout: LayoutType;
  sort: SortField;
  order: SortOrder;
}

export const parseViewParams = (url: URL): ViewParams => {
  const layout = url.searchParams.get('layout');
  const sort = url.searchParams.get('sort');
  const order = url.searchParams.get('order');

  return {
    layout: layout === 'grid' ? 'grid' : 'list',
    sort: ['name', 'size', 'time'].includes(sort || '')
      ? (sort as SortField)
      : 'name',
    order: order === 'desc' ? 'desc' : 'asc',
  };
};

export const buildSortUrl = (
  basePath: string,
  currentParams: ViewParams,
  newSort?: SortField,
  newOrder?: SortOrder,
  newLayout?: LayoutType,
): string => {
  const params = new URLSearchParams();

  const layout = newLayout ?? currentParams.layout;
  const sort = newSort ?? currentParams.sort;
  let order = newOrder ?? currentParams.order;

  // If clicking the same sort field, toggle order
  if (newSort && newSort === currentParams.sort && !newOrder) {
    order = currentParams.order === 'asc' ? 'desc' : 'asc';
  }

  if (layout !== 'list') params.set('layout', layout);
  if (sort !== 'name') params.set('sort', sort);
  if (order !== 'asc') params.set('order', order);

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
      case 'name': {
        result = a.name.localeCompare(b.name);
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

  // Directories first, then files, both sorted
  return [
    ...directories.sort(compareFunc),
    ...files.sort(compareFunc),
  ];
};

export const getSortIndicator = (
  field: SortField,
  currentSort: SortField,
  currentOrder: SortOrder,
): string => {
  if (field !== currentSort) return '';
  const ascSvg = Up;
  const descSvg = Down;
  return currentOrder === 'asc' ? ascSvg : descSvg;
};
