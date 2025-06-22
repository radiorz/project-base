import { Message, MessageType } from "../core/message";
import { Event } from "./event";

export interface EventMessage extends Message {
    type: MessageType.event
    meta: Message['meta'] & {
        qos: 2;
        retain: true
    }
    payload: Event
}
