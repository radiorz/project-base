import { EventSchema } from "../event";

export namespace CallAlarm {
  export enum AlarmCode {
    initialError = 20000,
    connectError
  }

  // 设备自检或初始时发生异常
  export const initialError: EventSchema = {
    code: AlarmCode.initialError,
    level: 4,
    name: "callInitialError",
    title: "自检或初始时发生异常"
  };
  export const connectError: EventSchema = {
    code: AlarmCode.connectError,
    level: 5,
    name: "callConnectError",
    title: "自检或初始时发生异常",
    payloadSchema: {
      type: "object",
      properties: {
        // sip: {
        //   type: "number"
        // },
        // free: {

        // }
      }
    }
  }
}
