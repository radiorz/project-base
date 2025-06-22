import { Message, MessageType } from "../core/message";
import { Action } from './Action.type'
export interface ActionMessage extends Message<Action> {
    type: MessageType.action;
}
