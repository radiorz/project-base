import { Message, MessageSchema, MessageVariables } from '@tikkhun/protocol-core';

export interface Messenger {
  // 所有消息都有schema
  emit<Payload>(messageSchema: MessageSchema, messageVariables: MessageVariables<Payload>): void;
  on(messageSchema: MessageSchema, callback: (message: Message) => void): void;
}
