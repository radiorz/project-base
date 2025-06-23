import { ActionSchema } from "../core/action/Action.type";

export const dataAction: ActionSchema = {
    name: 'data',
    title: '数据',
    description: '数据',
    payloadSchema: {
        data: {
            type: 'string',
            title: '数据',
            description: '数据',
        },
    },
}