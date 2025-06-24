import { ActionSchema } from "@tikkhun/protocol-core";

export const restartAction: ActionSchema = {
    name: 'restart',
    title: '重启',
    description: '重启设备',
    payloadSchema: {
        type: 'object',
        properties: {
            delay: {
                type: 'number',
                description: '延迟时间',
            }
        }
    }
}
