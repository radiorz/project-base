// 状态变更message

import { createEventSchema } from '@/event';
import { configUpdatedEventCode } from '@/event-codes';

export const configUpdatedEvent = createEventSchema({
  code: configUpdatedEventCode,
  name: 'config',
  title: '配置变更',
  subType: 'config',
  // 具体配置对应具体 payloadSchema
  payloadSchema: {
    type: 'object',
  },
});
// export function  createConfigSchema (schema:){

// }
export interface ConfigUpdatePayload<V = any> {
  value: V;
  oldValue: V;
}
