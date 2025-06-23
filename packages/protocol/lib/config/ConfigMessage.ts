import { Affair } from "../core/affair";
import { Message, MessageType } from "../core/message";
import { Config } from "./config";

export interface ConfigMessage extends Message<Affair<ConfigUpdatePayload> | ConfigUpdatePayload> {
  type: MessageType.config
}

export interface ConfigUpdatePayload<Value = any> {
  value?: Value; // 可能变成undefiend
  oldValue?: Value;
}


