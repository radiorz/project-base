import { ActionSchema } from "../Action.type";
// 目前指人脸证书啥的
export const AuthorizeActionSchema: ActionSchema = {
    name: 'authorize',
    title: '下发认证信息',
    description: '下发认证信息',
    payloadSchema: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                title: '认证类型',
                description: '认证类型',
            },
            url: {
                type: 'string',
                title: '认证文件下载地址',
                description: '认证文件下载地址',
            }
        },
    },
}

export interface AuthorizePayload {
    type: string; // 类型
    url: string,
}