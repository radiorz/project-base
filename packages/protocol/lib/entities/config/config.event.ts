import { EventMessage, Message, MessageType } from '@/core';
export interface ConfigUpdateEventMessage<Value> extends EventMessage<ConfigUpdatePayload<Value>> {
  type: MessageType.config;
}

export interface ConfigUpdatePayload<Value = any> {
  value?: Value; // 可能变成undefiend
  oldValue?: Value;
}
