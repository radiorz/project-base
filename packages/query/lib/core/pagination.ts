export interface PaginationQuery {
  page: number; // 当前页码
  pageSize: number; // 每页显示的记录数
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    pageSize: number;
    current: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function getLimitOffsetFromPaginationQuery(page: number, pageSize: number) {
  const offset = (page - 1) * pageSize;
  return { limit: pageSize, offset };
}

