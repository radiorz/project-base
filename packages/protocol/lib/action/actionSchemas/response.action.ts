import { ActionSchema } from "../Action.type";

// 或者叫 answer
export const responseAction: ActionSchema = {
    name: 'response',
    title: '响应',
    description: '响应',
    payloadSchema: {
        response: {
            type: 'string',
            title: '响应',
            description: '响应',
        },
    },
}