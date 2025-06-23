import { ActionSchema } from "../core/action/Action.type";

export const rebootActionSchema: ActionSchema = {
    name: 'reboot',
    title: "重启",
    description: '重启设备',
    payloadSchema: {
        type: 'object',
        properties: {
            delay: {
                type: 'number',
                description: '延迟时间（毫秒）',
            }
        },
    },
}

export interface RebootPayload {
    delay: number;
}