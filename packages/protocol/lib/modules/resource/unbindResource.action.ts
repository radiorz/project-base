import { createRequestSchema } from '@tikkhun/protocol-core';
import { ResourceSchema } from './resource';

export const unbindResourceActionSchema = createRequestSchema({
  name: 'unbindResource',
  title: '解绑资源',
  description: '解绑资源',
  payloadSchema: ResourceSchema,
});
