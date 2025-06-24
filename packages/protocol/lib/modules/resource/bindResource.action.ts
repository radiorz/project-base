import { createRequestSchema } from '@tikkhun/protocol-core';
import { ResourceSchema } from './resource';

export const bindResourceActionSchema = createRequestSchema({
  name: 'bindResource',
  title: '绑定资源',
  description: '绑定资源',
  payloadSchema: ResourceSchema,
});
