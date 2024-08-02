export const MessageType = {
  Request: 'Request',
  Response: 'Response',
} as const;
export type MessageType = keyof typeof MessageType;
export interface Message {
  from: string;
  to: string;
  sessionId: string;
  url: string;
  type: MessageType;
  payload: any;
}
export interface Callback {
  (message: Message): void;
}
export interface Emitter {
  on(topic: string, callback: Callback): void;
  emit(topic: string, message: Message): void;
  [props: string]: any;
}
