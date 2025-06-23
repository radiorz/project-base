import { EventMessage } from '@tikkhun/protocol-core';
export interface ConfigUpdatedEventMessage<Value> extends EventMessage<ConfigUpdatedPayload<Value>> {}

export interface ConfigUpdatedPayload<Value = any> {
  value?: Value; // 可能变成undefiend
  oldValue?: Value;
}
