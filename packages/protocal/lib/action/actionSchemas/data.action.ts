import { ActionSchema } from "../Action.type";

export const dataAction: ActionSchema = {
    name: 'data',
    title: '数据',
    description: '数据',
    paramSchema: {
        data: {
            type: 'string',
            title: '数据',
            description: '数据',
        },
    },
}