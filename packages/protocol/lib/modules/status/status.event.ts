// 状态变更message

import { Message, MessageType } from '@tikkhun/protocol-core';

export interface StatusUpdatedMessage extends Message {
  type: MessageType.event;
  meta: Message['meta'] & {
    qos: 2;
    retain: true;
  };
  payload: {
    level: number; // 等级
    message?: string; // 消息
    // 这里是一个对象，但其实最好还value oldValue
    status: Record<string, any>; // 比如 { calling: true,  online: false }
  };
}
