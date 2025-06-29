import { ActionSchema } from '@tikkhun/protocol-core';
import { accessSchema } from './access';

export const bindDoorAccessResourceAction: ActionSchema = {
  name: 'bindDoorAccessResource',
  title: '绑定门磁资源',
  payloadSchema: accessSchema
};
