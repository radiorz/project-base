import { ActionSchema } from "../Action.type";

// 注册
export const registerAction: ActionSchema = {
    name: 'register',
    title: '注册',
    description: '注册',
    paramSchema: {
        name: {
            type: 'string',
            title: '名称',
            description: '名称',
        },
    },
}
