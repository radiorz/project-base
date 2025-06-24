import { createRequestSchema } from '@/action';

export const updateStatusAction = createRequestSchema({
  name: 'updateStatus',
  payloadSchema: {
    type: 'object',
  },
});
