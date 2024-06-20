interface LimitOffsetToPageOptions {
  limit: number;
  offset: number;
}
const defaultLimitOffsetToPageOptions = {
  limit: 0,
  offset: 0,
};
export function limitOffsetToPage(options: LimitOffsetToPageOptions) {
  const { limit, offset } = Object.assign(defaultLimitOffsetToPageOptions, options);
  return {
    pageSize: 0,
    pageNo: 0,
  };
}
