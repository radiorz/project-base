import { Message, MessageSchema, MessageType } from '../message';

export interface EventSchema extends MessageSchema {
  type: MessageType.event;
}

export interface Event<P> extends Message<P> {}
export interface BuildUniqueEventNameOptions extends Pick<EventSchema, 'module' | 'name' | 'subType' | 'type'> {}

export function buildUniqueEventName(options: BuildUniqueEventNameOptions) {
  return [options.module ?? 'default', options.type, options.subType, options.name].join('/');
}
