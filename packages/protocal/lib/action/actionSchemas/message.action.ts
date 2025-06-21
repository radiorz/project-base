import { ActionSchema } from "../Action.type";

export const messageAction: ActionSchema = {
    name: 'message',
    title: '消息',
    description: '消息',
    paramSchema: {
        message: {
            type: 'string',
            title: '消息',
            description: '消息',
        },
    },
}