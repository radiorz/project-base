import { EventSchema } from "../event";

export namespace IOEvent {
    export const ManualButtonPressSchema = {
        type: "object",
        properties: {
            code: {
                type: 'number',
                const: 4000,
                description: '人工按键事件编码'
            }
        }
    };
    export interface ManualButtonPressPayload {
        code: 4000;
    }
    export const manualButtonPress: EventSchema = {
        code: 4000,
        level: null,
        name: "manualButtonPress",
        title: "人工按键"
    };

    export const ShortCircuitInputSchema = {
        type: "object",
        properties: {
            code: {
                type: 'number',
                const: 4001,
                description: '短路输入事件编码'
            }
        }
    };
    export interface ShortCircuitInputPayload {
        code: 4001;
    }
    export const shortCircuitInput: EventSchema = {
        code: 4001,
        level: null,
        name: "shortCircuitInput",
        title: "短路输入"
    };
    // 可继续添加其他 I/O 事件定义
}