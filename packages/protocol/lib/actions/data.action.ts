import { ActionSchema } from '@tikkhun/protocol-core';

export const dataAction: ActionSchema = {
  name: 'data',
  title: '数据',
  description: '数据',
  payloadSchema: {
    type: 'object',
    properties: {
      name: {},
      data: {
        type: 'string',
        title: '数据',
        description: '数据',
      },
    },
  },
};
