import { createRequestSchema } from '@/action';

export const UpdateConfigAction = createRequestSchema({
  name: 'updateConfig',
  title: '更新配置',
  payloadSchema: {
    type: 'object',
  },
});
