import { Message, MessageSchema, MessageType } from '../message';
export enum ActionSubType {
  request = 'request',
  response = 'response',
}
export interface ActionSchema extends MessageSchema {
  type: MessageType.action;
  subType: ActionSubType;
}

// 真正下发的动作数据
export interface Action<P> extends Message<P> {
  type: MessageType.action;
}
