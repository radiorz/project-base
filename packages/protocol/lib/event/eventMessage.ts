import { Message, MessageType } from "../core/message";
import { Event } from "./event";

export interface EventMessage extends Message {
    type: MessageType.event,
    payload: Event
}