interface LimitOffsetToPageOptions {
  limit: number;
  offset: number;
}

const defaultLimitOffsetToPageOptions: LimitOffsetToPageOptions = {
  limit: 0,
  offset: 0,
};

export function limitOffsetToPage(options: LimitOffsetToPageOptions) {
  const { limit, offset } = Object.assign({}, defaultLimitOffsetToPageOptions, options);
  const pageSize = limit > 0 ? limit : 0;
  const pageNo = offset >= 0 ? Math.floor(offset / pageSize) + 1 : 0;

  return {
    pageSize,
    pageNo,
  };
}
