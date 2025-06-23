import { EventSchema } from '../core/event/event';
export namespace EndpointEvent {
  enum EventCode {
    ready = 1000, // 开机之后准备完成后触发
    off = 1001, // 一般是关机前触发
    updateStatus = 1002,
    updateConfig = 1003,
    affairProgress = 1004,
    cancelAlarm,
    isAlarmHandled,
    performance,
    log,
  }
  export const off: EventSchema = {
    code: EventCode.off,
    level: 3,
    name: 'isEndpointOff',
  };
  export const ready: EventSchema = {
    code: EventCode.ready,
    level: 3,
    name: 'isEndpointReady',
  };

  // 状态变更
  export const updateStatus: EventSchema = {
    code: EventCode.updateStatus,
    level: 3,
    name: 'updateEndpointStatus',
    payloadSchema: {
      type: 'object',
      properties: {
        progress: {
          type: 'number',
        },
        result: {
          type: 'number',
        },
      },
    },
  };
  export interface UpdateStatusPayload {
    payload: { [key: string]: any };
    // affair
    progress: number;
    result: number;
  }
  // 配置变更
  export const updateConfig: EventSchema = {
    code: EventCode.updateConfig,
    level: 3,
    name: 'updateEndpointConfig',
  };
  export interface UpdateConfigPaylaod {
    payload: { [key: string]: any };
    // affair
    progress: number;
    result: number;
  }
  // 事务进度
  export const AffairProgress: EventSchema = {
    code: EventCode.affairProgress,
    level: 3,
    name: 'endpointAffairProgress',
  };

  export const cancelAlarm: EventSchema = {
    code: EventCode.cancelAlarm,
    level: 3,
    name: 'cancelAlarm',
  };

  export const isAlarmHandled: EventSchema = {
    code: EventCode.isAlarmHandled,
    level: 3,
    name: 'isAlarmHandled',
  };
  // 性能报告
  export const Performance: EventSchema = {
    code: EventCode.performance,
    level: 3,
    name: 'endpointPerformance',
  };
  export const log: EventSchema = {
    code: EventCode.log,
    level: 3,
    name: 'endpointLog',
    payloadSchema: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'number',
        },
        level: {
          type: 'number',
          description: '日志等级',
        },
        message: {
          type: 'string',
        },
        tags: {
          type: 'object',
        },
      },
    },
  };
}

export interface Log {
  timestamp: number;
  level: number;
  message: string;
  tag: { [key: string]: any };
}
