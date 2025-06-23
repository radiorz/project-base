import { EventSchema } from "../event"
export namespace EndpointEvent {

  enum EndpointEventCode {
    ready = 1000, // 开机之后准备完成后触发
    off = 1001, // 一般是关机前触发
    updateStatus = 1002, 
    updateConfig = 1003,
    affairProgress = 1004,
    cancelAlarm,
    isAlarmHandled,
    performance
  }
  export const off: EventSchema = {
    code: EndpointEventCode.off,
    level: 3,
    name: "isEndpointOff"
  }
  export const Ready: EventSchema = {
    code: EndpointEventCode.ready,
    level: 3,
    name: "isEndpointReady"
  }

  // 状态变更
  export const updateStatus: EventSchema = {
    code: EndpointEventCode.updateStatus,
    level: 3,
    name: 'updateEndpointStatus',
    payloadSchema: {
      type: "object",
      properties: {
        progress: {
          type: "number"
        }, result: {
          type: "number"
        }
      }
    },
  }
  export interface UpdateStatusPaylaod {
    payload: { [key: string]: any },
    // affair
    progress: number,
    result: number
  }
  // 配置变更
  export const updateConfig: EventSchema = {
    code: EndpointEventCode.updateConfig,
    level: 3,
    name: "updateEndpointConfig"
  }
  export interface UpdateConfigPaylaod {
    payload: { [key: string]: any },
    // affair
    progress: number,
    result: number
  }
  // 事务进度
  export const AffairProgress: EventSchema = {
    code: EndpointEventCode.affairProgress,
    level: 3,
    name: "endpointAffairProgress"
  }

  export const cancelAlarm: EventSchema = {
    code: EndpointEventCode.cancelAlarm,
    level: 3,
    name: "cancelAlarm"
  }

  export const isAlarmHandled: EventSchema = {
    code: EndpointEventCode.isAlarmHandled,
    level: 3,
    name: "isAlarmHandled"
  }
  // 性能报告
  export const Performance: EventSchema = {
    code: EndpointEventCode.performance,
    level: 3,
    name: "endpointPerformance"
  }
}
