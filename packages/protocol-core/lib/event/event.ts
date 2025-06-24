import { createMessage, Message, MessageSchema, MessageType } from '../core/message';

export interface EventSchema extends MessageSchema {
  type: MessageType.event;
}

export interface Event<P> extends Message<P> {}
export interface BuildUniqueEventNameOptions extends Pick<EventSchema, 'module' | 'name' | 'subType' | 'type'> {}

export function buildUniqueEventName(options: BuildUniqueEventNameOptions) {
  return [options.module ?? 'default', options.type, options.subType, options.name].join('/');
}

export type EventDefine = Omit<EventSchema, 'type'>;
export function createEventSchema(schema: EventDefine): EventSchema {
  return {
    ...schema,
    type: MessageType.event,
  };
}

export type EventVariables<P> = Omit<Event<P>, 'type' | 'subType' | 'module' | 'name' | 'code'>;
export function createEventMessage<P>(eventSchema: EventSchema, event: EventVariables<P>): Event<P> {
  return createMessage<P>(eventSchema, event) as Event<P>;
}
