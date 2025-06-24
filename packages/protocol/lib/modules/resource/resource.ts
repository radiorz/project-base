export interface Resource {
  type: string;
  name: string;
}
export const ResourceSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
  },
  required: ['type', 'name'],
};

export const ResourceUpdateSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    // 其他的值放在这里面
    value: {
      type: 'object',
    },
  },
  required: ['type', 'name', 'value'],
};
