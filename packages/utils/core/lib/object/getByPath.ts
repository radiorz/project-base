import _ from 'lodash';
const { get } = _;
export function getByPath(this: any, config: Record<string, any>, path: string = '') {
  const self = config ?? this;
  if (!path) {
    return self;
  }
  return get(self, path);
}
