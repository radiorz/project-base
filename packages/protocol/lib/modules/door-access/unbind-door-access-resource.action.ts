import { ActionSchema } from '@tikkhun/protocol-core';
import { accessSchema } from './access';

export const unbindDoorAccessResourceAction: ActionSchema = {
  name: 'unbindDoorAccessResource',
  title: '解绑门磁资源',
  payloadSchema: accessSchema
};
