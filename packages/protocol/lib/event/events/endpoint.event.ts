import { EventSchema } from "../event"
export namespace EndpointEvent {

    enum EndpointEventCode {
        off = 1000,
        ready = 1001,
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
        name: "off"
    }
    export const Ready: EventSchema = {
        code: EndpointEventCode.ready,
        level: 3,
        name: "ready"
    }
    // 状态变更
    export const StatusUpdate: EventSchema = {
        code: EndpointEventCode.updateStatus,
        level: 3,
        name: 'statusUpdate'
    }
    // 配置变更
    export const updateConfig: EventSchema = {
        code: EndpointEventCode.updateConfig,
        level: 3,
        name: "updateConfig"
    }
    // 事务进度
    export const AffairProgress: EventSchema = {
        code: EndpointEventCode.affairProgress,
        level: 3,
        name: "affairProgress"
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
        name: "performance"
    }
}