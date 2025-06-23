import { EventSchema } from "../event"
export namespace EndpointAlarm {

    enum EndpointEventCode {
        error = 10000,
        screenError, // 屏幕异常
        lowerPower,

    }


}
