export type PaginationOutputModel<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type RequestQueryParamsModel = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export const DEFAULT_QUERY_PARAMS: RequestQueryParamsModel = {
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  pageNumber: '1',
  pageSize: '10',
};
