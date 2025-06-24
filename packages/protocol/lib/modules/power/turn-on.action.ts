import { ActionSchema } from "@tikkhun/protocol-core";

export const turnOnActionSchema: ActionSchema = {
    name: 'turnOn',
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

export interface TurnOnPayload {
    delay?: number;
}

export const defaultTurnOnPayload: TurnOnPayload = {
    delay: 0
}