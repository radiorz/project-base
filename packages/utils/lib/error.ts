enum STATUS {
  success = 'success',
  error = 'error',
}
export function getSuccess(data: any) {
  return {
    status: STATUS.success,
    code: undefined,
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
