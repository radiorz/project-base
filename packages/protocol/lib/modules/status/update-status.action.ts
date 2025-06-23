import { ActionSchema } from '@tikkhun/protocol-core';

export const updateStatusAction: ActionSchema = {
  name: 'updateStatus',
  payloadSchema: {
    type: 'object',
  },
};
