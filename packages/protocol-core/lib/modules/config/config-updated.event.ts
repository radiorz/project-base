// 状态变更message

import { createEventSchema } from '@/event';

export const ConfigUpdatedEvent = createEventSchema({
  code: '1001',
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
