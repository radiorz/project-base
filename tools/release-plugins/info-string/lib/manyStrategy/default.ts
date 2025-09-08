export function defaultStrategy(v: any) {
  if (typeof v === 'object') {
    return JSON.stringify(v);
  }
  return '' + v;
}
