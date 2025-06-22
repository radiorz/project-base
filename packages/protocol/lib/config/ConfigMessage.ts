import { Message, MessageType } from "../core/message";
import { Config } from "./config";
export interface ConfigMessage extends Message {
  type: MessageType.config
  // payload 就是变更的
  payload: Config;
}



