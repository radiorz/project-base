import { AffairMessage } from "../core/affair";
import { Message, MessageType } from "../core/message";
import { Event } from "./event";
// 凡是事件皆是事务
export interface EventMessage<Payload = Record<string, any>> extends AffairMessage<Event<Payload>> {
  type: MessageType.event
  meta: Message['meta'] & {
    qos: 2;
    retain: true
  }
}
