// 状态变更message

import { createEventSchema } from '@/event';

export const StatusUpdatedEvent = createEventSchema({
  code: '1002',
  name: 'status',
  title: '状态变更',
});
