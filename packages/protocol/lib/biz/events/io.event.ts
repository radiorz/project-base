import { EventSchema } from "../core/event/event";

export namespace IOEvent {
    export const IOPayloadSchema = {
        type: "object",
        properties: {}
    };
    
    export interface IOPayload {}
    
    enum IOEventCode {
        manualButtonPress = 4000,
        shortCircuitInput,
        wireless433Access,
        bluetoothAccess,
        uiButton,
        
    }

    export const manualButtonPress: EventSchema = {
        code: IOEventCode.manualButtonPress,
        name: "manualButtonPress",
        title: "人工按键"
    };

    export const shortCircuitInput: EventSchema = {
        code: IOEventCode.shortCircuitInput,
        name: "shortCircuitInput",
        title: "短路输入"
    };

    export const wireless433Access: EventSchema = {
        code: IOEventCode.wireless433Access,
        name: "wireless433Access",
        title: "433无线接入"
    };

    export const bluetoothAccess: EventSchema = {
        code: IOEventCode.bluetoothAccess,
        name: "bluetoothAccess",
        title: "蓝牙无线接入"
    };

    export const uiButton: EventSchema = {
        code: IOEventCode.uiButton,
        name: "uiButton",
        title: "UI界面按钮"
    };
}