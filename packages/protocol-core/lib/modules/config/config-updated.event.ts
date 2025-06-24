// 状态变更message

import { createEventSchema } from '@/event';

export const ConfigUpdatedEvent = createEventSchema({
  code: '1001',
  name: 'config',
  title: '配置变更',
  payloadSchema: {
    type: 'object',
  },
});
export interface ConfigUpdatePayload {
  value: any;
  oldValue: any;
}
