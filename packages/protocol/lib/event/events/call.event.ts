import { EventSchema } from "../event";
export namespace CallEvent {

    export const CallPaylaodSchema = {
        type: "object",
        properties: {
            from: {
                type: 'string',
                description: '主叫号码',
            },
            to: {
                type: 'string',
                description: '被叫号码',
            }
        }
    }
    export interface CallPaylaod {
        from: string;
        to: string;
    }
    // 扩展 CallEventCode 枚举，添加新的事件编码
    enum CallEventCode {
        // 已有编码
        idle = 2000,
        offHook,
        callOut,
        cancelCallOut,
        // 新增编码
        callConnected = 2004,
        callOutEnded,
        callIn = 2100,
        callInRejected,
        callInAccepted,
        callInEnded,
        callTransferred,
        callOnHold,
        mediaStreamConnected = 2200,
        mediaStreamDisconnected,
        callPaused = 2300,
        callResumed,
        
    }

    export const idle: EventSchema = {
        code: CallEventCode.idle,
        level: 3,
        name: "idle",
        title: "空闲"
    }
    export const offHook: EventSchema = {
        code: CallEventCode.offHook,
        level: 3,
        name: "offHook",
        title: "摘机"
    }
    export const callOut: EventSchema = {
        code: CallEventCode.callOut,
        level: 3,
        name: "callOut",
        title: "呼出"
    }
    export const cancelCallOut: EventSchema = {
        code: CallEventCode.cancelCallOut,
        level: 3,
        name: "cancelCallOut",
        title: "取消呼出"
    }

    export const callConnected: EventSchema = {
        code: CallEventCode.callConnected,
        level: 3,
        name: "callConnected",
        title: "通话：呼出被接通"
    }
    export const callOutEnded: EventSchema = {
        code: CallEventCode.callOutEnded,
        level: 3,
        name: "callOutEnded",
        title: "通话：呼出结束"
    }
    export const callIn: EventSchema = {
        code: CallEventCode.callIn,
        level: 3,
        name: "callIn",
        title: "通话：呼入"
    }
    export const callInRejected: EventSchema = {
        code: CallEventCode.callInRejected,
        level: 3,
        name: "callInRejected",
        title: "通话：拒接呼入"
    }
    export const callInAccepted: EventSchema = {
        code: CallEventCode.callInAccepted,
        level: 3,
        name: "callInAccepted",
        title: "通话：接受呼入"
    }
    export const callInEnded: EventSchema = {
        code: CallEventCode.callInEnded,
        level: 3,
        name: "callInEnded",
        title: "通话：结束呼入"
    }
    export const callTransferred: EventSchema = {
        code: CallEventCode.callTransferred,
        level: 3,
        name: "callTransferred",
        title: "通话：转移呼叫"
    }
    export const callOnHold: EventSchema = {
        code: CallEventCode.callOnHold,
        level: 3,
        name: "callOnHold",
        title: "通话：呼叫等待"
    }
    export const mediaStreamConnected: EventSchema = {
        code: CallEventCode.mediaStreamConnected,
        level: 3,
        name: "mediaStreamConnected",
        title: "通话：连接媒体流"
    }
    export const mediaStreamDisconnected: EventSchema = {
        code: CallEventCode.mediaStreamDisconnected,
        level: 3,
        name: "mediaStreamDisconnected",
        title: "通话：断开媒体流"
    }
    export const callPaused: EventSchema = {
        code: CallEventCode.callPaused,
        level: 3,
        name: "callPaused",
        title: "通话：暂停呼叫"
    }
    export const callResumed: EventSchema = {
        code: CallEventCode.callResumed,
        level: 3,
        name: "callResumed",
        title: "通话：恢复呼叫"
    }
}