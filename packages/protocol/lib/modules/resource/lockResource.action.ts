import { ActionSchema } from '@tikkhun/protocol-core';
import { ResourceSchema } from './resource';

export const lockResourceActionSchema: ActionSchema = {
  name: 'lockResource',
  title: '绑定资源',
  description: '绑定资源',
  payloadSchema: ResourceSchema,
};
