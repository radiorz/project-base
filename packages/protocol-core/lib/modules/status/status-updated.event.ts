// 状态变更message

import { createEventSchema } from '@/event';
import { statusUpdatedEventCode } from '@/event-codes';

export const statusUpdatedEvent = createEventSchema({
  code: statusUpdatedEventCode,
  name: 'status',
  title: '状态变更',
});
