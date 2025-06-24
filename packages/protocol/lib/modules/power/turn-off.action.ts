import { ActionSchema } from "@tikkhun/protocol-core";

export const turnOffActionSchema: ActionSchema = {
    name: 'turnOff',
    title: '关停',
    description: '关机设备',
    payloadSchema: {
        type: 'object',
        properties: {
            delay: {
                type: 'number',
                description: '延迟时间',
            }
        },
    },
}

export interface TurnOffPayload {
    delay?: number;
}

export const defaultTurnOffPayload: TurnOffPayload = {
    delay: 0
}