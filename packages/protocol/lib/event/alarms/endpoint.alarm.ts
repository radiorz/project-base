import { EventSchema } from "../event";

export namespace EndpointAlarm {
    export enum AlarmCode {
        deviceSelfTestError = 10000,
        screenError,
        lowPowerWarning,
        networkModuleError,
        storageInsufficient,
        firmwareUpgradeFailed,
        logStorageFull,
        logServerUnreachable,
        remoteDebugEnabled,
        insufficientMemory,
        highCpuLoad,
        subDeviceRegistrationFailed,
        mainPowerDisconnected,
        tamperAlarm,
        disconnectionAlarm,
        shutdownAlarm,
        ipConflict
    }

    // 设备自检或初始时发生异常
    export const deviceSelfTestError: EventSchema = {
        code: AlarmCode.deviceSelfTestError,
        level: 4,
        name: "deviceSelfTestError",
        title: "设备自检或初始时发生异常"
    };

    // 屏幕异常
    export const screenError: EventSchema = {
        code: AlarmCode.screenError,
        level: 3,
        name: "screenError",
        title: "屏幕异常"
    };

    // 低电警告
    export const lowPowerWarning: EventSchema = {
        code: AlarmCode.lowPowerWarning,
        level: 4,
        name: "lowPowerWarning",
        title: "低电警告",
        payloadSchema: {
            type: "object",
            properties: {
                quantity: { type: "number", description: "剩余电量" }
            },
            required: ["quantity"]
        }
    };

    // 2G/3G/4G模块异常
    export const networkModuleError: EventSchema = {
        code: AlarmCode.networkModuleError,
        level: 1,
        name: "networkModuleError",
        title: "2G/3G/4G模块异常"
    };

    // 存储空间不足
    export const storageInsufficient: EventSchema = {
        code: AlarmCode.storageInsufficient,
        level: 3,
        name: "storageInsufficient",
        title: "存储空间不足",
        payloadSchema: {
            type: "object",
            properties: {
                total: { type: "number", description: "总空间" },
                free: { type: "number", description: "剩余空间" }
            },
            required: ["total", "free"]
        }
    };

    // 固件升级失败
    export const firmwareUpgradeFailed: EventSchema = {
        code: AlarmCode.firmwareUpgradeFailed,
        level: 3,
        name: "firmwareUpgradeFailed",
        title: "固件升级失败",
        payloadSchema: {
            type: "object",
            properties: {
                from: { type: "string", description: "当前版本" },
                to: { type: "string", description: "升级版本" },
                filename: { type: "string", description: "固件文件名称" },
                filesize: { type: "number", description: "固件文件大小" }
            },
            required: ["from", "to", "filename", "filesize"]
        }
    };

    // 日志空间满或不能正常工作
    export const logStorageFull: EventSchema = {
        code: AlarmCode.logStorageFull,
        level: 5,
        name: "logStorageFull",
        title: "日志空间满或不能正常工作"
    };

    // 无法连接到日志服务器
    export const logServerUnreachable: EventSchema = {
        code: AlarmCode.logServerUnreachable,
        level: 3,
        name: "logServerUnreachable",
        title: "无法连接到日志服务器",
        payloadSchema: {
            type: "object",
            properties: {
                server: { type: "string", description: "日志服务器地址" }
            },
            required: ["server"]
        }
    };

    // 远程DEBUG开启
    export const remoteDebugEnabled: EventSchema = {
        code: AlarmCode.remoteDebugEnabled,
        level: 1,
        name: "remoteDebugEnabled",
        title: "远程DEBUG开启"
    };

    // 内存不足
    export const insufficientMemory: EventSchema = {
        code: AlarmCode.insufficientMemory,
        level: 5,
        name: "insufficientMemory",
        title: "内存不足",
        payloadSchema: {
            type: "object",
            properties: {
                total: { type: "number", description: "总内存" },
                free: { type: "number", description: "剩余内存" }
            },
            required: ["total", "free"]
        }
    };

    // CPU负载高
    export const highCpuLoad: EventSchema = {
        code: AlarmCode.highCpuLoad,
        level: 3,
        name: "highCpuLoad",
        title: "CPU负载高"
    };

    // 子设备注册失败
    export const subDeviceRegistrationFailed: EventSchema = {
        code: AlarmCode.subDeviceRegistrationFailed,
        level: 2,
        name: "subDeviceRegistrationFailed",
        title: "子设备注册失败"
    };

    // 设备主电源已断开（掉电）
    export const mainPowerDisconnected: EventSchema = {
        code: AlarmCode.mainPowerDisconnected,
        level: 3,
        name: "mainPowerDisconnected",
        title: "设备主电源已断开（掉电）",
        payloadSchema: { type: "object", properties: {} }
    };

    // 设备防拆告警
    export const tamperAlarm: EventSchema = {
        code: AlarmCode.tamperAlarm,
        level: 4,
        name: "tamperAlarm",
        title: "设备防拆告警",
        payloadSchema: { type: "object", properties: {} }
    };

    // 设备断线告警
    export const disconnectionAlarm: EventSchema = {
        code: AlarmCode.disconnectionAlarm,
        level: 4,
        name: "disconnectionAlarm",
        title: "设备断线告警（可能是断网或者无法连接服务器等）",
        payloadSchema: { type: "object", properties: {} }
    };

    // 设备关机告警
    export const shutdownAlarm: EventSchema = {
        code: AlarmCode.shutdownAlarm,
        level: 4,
        name: "shutdownAlarm",
        title: "设备关机告警",
        payloadSchema: { type: "object", properties: {} }
    };

    // 设备IP冲突
    export const ipConflict: EventSchema = {
        code: AlarmCode.ipConflict,
        level: 2,
        name: "ipConflict",
        title: "设备IP冲突",
        payloadSchema: { type: "object", properties: {} }
    };
}
