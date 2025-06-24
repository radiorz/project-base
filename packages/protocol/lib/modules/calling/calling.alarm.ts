import { createEventSchema } from '@tikkhun/protocol-core';
import { alarm } from '../event-types';

export namespace CallAlarm {
  export enum AlarmCode {
    initialError = 20000,
    connectError,
  }
  const module = 'calling';
  // 设备自检或初始时发生异常
  export const initialError = createEventSchema({
    code: AlarmCode.initialError,
    level: 4,
    module: module,
    subType: alarm,
    name: 'initialError',
    title: '自检或初始时发生异常',
  });
  export const connectError = createEventSchema({
    code: AlarmCode.connectError,
    level: 5,
    module: module,
    subType: alarm,
    name: 'connectError',
    title: '服务器连接异常',
    payloadSchema: {
      type: 'object',
      properties: {
        // sip: {
        //   type: "number"
        // },
        // free: {
        // }
      },
    },
  });
}
