import { Message, MessageType } from "../message";
import { Action } from './action'
export interface ActionMessage extends Message<Action> {
    type: MessageType.action;
}
