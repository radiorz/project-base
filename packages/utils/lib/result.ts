enum STATUS {
  success = 'success',
  error = 'error',
}
export function getResult(data: any, type: STATUS) {
  if (type === 'error') {
    return getSuccess(data);
  }
  return getError(data);
}
export function getSuccess(data: any) {
  return {
    status: STATUS.success,
    code: data.code,
    error: '',
    data,
  };
}
export function getError(error: Error) {
  return {
    status: STATUS.error,
    code: undefined,
    error: error.message,
    data: null,
  };
}
