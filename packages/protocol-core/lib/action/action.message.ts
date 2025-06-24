import { createMessage, Message, MessageSchema, MessageType } from '../core/message';
export enum ActionSubType {
  request = 'request',
  response = 'response',
}
export interface ActionSchema extends MessageSchema {
  type: MessageType.action;
  subType: ActionSubType;
}

// 真正下发的动作数据
export interface Action<P = any> extends Message<P> {
  type: MessageType.action;
}
export function createActionSchema(action: Omit<ActionSchema, 'type'>): ActionSchema {
  return {
    type: MessageType.action,
    ...action,
  };
}
export function createRequestSchema(action: Omit<ActionSchema, 'type' | 'subType'>): ActionSchema {
  return createActionSchema({
    subType: ActionSubType.request,
    ...action,
  });
}
export function createResponseSchema(action: Omit<ActionSchema, 'type' | 'subType'>): ActionSchema {
  return createActionSchema({
    subType: ActionSubType.response,
    ...action,
  });
}

export function createActionMessage<P>(
  actionSchema: ActionSchema,
  action: Omit<Action<P>, 'type' | 'subType' | 'module' | 'name' | 'code'>,
): Action<P> {
  return createMessage<P>(actionSchema, action) as Action<P>;
}
