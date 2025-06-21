import { ActionSchema } from "../Action.type";

// 或者叫 query
export const requestAction: ActionSchema = {
    name: 'request',
    title: '请求',
    description: '请求',
    paramSchema: {
        query: {
            type: 'object',
            title: '请求',
            description: '请求',
        },
    },
}