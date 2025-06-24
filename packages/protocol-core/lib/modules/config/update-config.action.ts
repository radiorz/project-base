import { createRequestSchema } from '@/action';

export const updateConfigAction = createRequestSchema({
  name: 'updateConfig',
  title: '更新配置',
  payloadSchema: {
    type: 'object',
  },
});
