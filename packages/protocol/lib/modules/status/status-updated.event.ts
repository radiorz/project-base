// 状态变更message

import { Message, MessageType } from '@tikkhun/protocol-core';
import { EventSchema } from '@tikkhun/protocol-core';

export const StatusUpdatedEvent: EventSchema = {
  code: '1002',
  name: 'status',
  title: '状态变更',
};
