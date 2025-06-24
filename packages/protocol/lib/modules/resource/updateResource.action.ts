import { createRequestSchema } from '@tikkhun/protocol-core';
import { ResourceUpdateSchema } from './resource';

export const updateResourceActionSchema = createRequestSchema({
  name: 'updateResource',
  title: '绑定资源',
  description: '绑定资源',
  payloadSchema: ResourceUpdateSchema,
});
