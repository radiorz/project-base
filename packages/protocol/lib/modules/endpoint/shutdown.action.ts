import { ActionSchema } from "@tikkhun/protocol-core";

export const shutdownActionSchema: ActionSchema = {
    name: 'shutdown',
    title: '关机',
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

export interface ShutdownPayload {
    delay: number;
}
