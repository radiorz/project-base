import { Message, MessageType } from "../core/message";
export interface ConfigMessage extends Message<ConfigUpdatePayload> {
  type: MessageType.config
}

export interface ConfigUpdatePayload<Value = any> {
  value?: Value; // 可能变成undefiend
  oldValue?: Value;
}


