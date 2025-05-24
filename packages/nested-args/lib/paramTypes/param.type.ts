export const TYPES = {
  array: 'array',
  keyValueArray: 'keyValueArray',
  objectArray: 'objectArray',
  boolean: 'boolean',
  number: 'number',
  object: 'object',
  string: 'string',
  select: 'select', // 几个中进行选择 选择一项
} as const;
export type TYPES = keyof typeof TYPES;
