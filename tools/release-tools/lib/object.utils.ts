import _ from 'lodash';
const { get } = _;
export function transObjByOptionsMap(obj: Record<string, any>, map: Record<string, string>) {
  const _tranedObj: Record<string, any> = {};
  Object.entries(map).forEach(([key, value]) => {
    _tranedObj[key] = get(obj, value);
  });
  return _tranedObj;
}
