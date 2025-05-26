export const TYPES = {
  boolean: 'boolean',
  number: 'number',
  string: 'string',
  array: 'array',
  keyValueArray: 'keyValueArray',
  objectArray: 'objectArray',
  object: 'object',
  json: 'json',
  // select: 'select', // 几个中进行选择 选择一项
} as const;
export type TYPES = keyof typeof TYPES;
