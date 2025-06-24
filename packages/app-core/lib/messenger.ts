export interface Messenger {
  emit(topic: string, messageSchema: MessageSchema, messageVariables: MessageVariables): void;
  on(topic: string, callback: (message: Message) => void): void;
}
