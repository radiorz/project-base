export interface Callback {
  (topic: string, message: any): void;
}
export interface Emitter {
  on(topic: string, callback: Callback): void;
  emit(topic: string, message: any): void;
  [props: string]: any;
}
