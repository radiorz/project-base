import { EventSchema } from "@tikkhun/protocol-core"
export namespace EndpointAlarm {
    export enum EventCode {
        error = 10000,
        screenError, // 屏幕异常
        lowerPower,
    }
}
