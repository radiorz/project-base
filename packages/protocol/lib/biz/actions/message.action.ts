import { ActionSchema } from "../core/action/Action.type";

export const messageAction: ActionSchema = {
    name: 'message',
    title: '消息',
    description: '消息',
    payloadSchema: {
        message: {
            type: 'string',
            title: '消息',
            description: '消息',
        },
    },
}