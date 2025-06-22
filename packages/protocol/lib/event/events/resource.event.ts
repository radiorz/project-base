import { EventSchema } from "../event";

export namespace ResourceEvent {
    export const CreateResourceSchema = {
        type: "object",
        properties: {
            code: {
                type: 'number',
                const: 3001,
                description: '创建资源事件编码'
            },
            url: {
                type: 'string',
                description: '资源 url'
            },
            resType: {
                type: 'string',
                description: '资源类型'
            },
            resId: {
                type: 'string',
                description: '资源 id'
            },
            params: {
                type: 'object',
                additionalProperties: true,
                description: '参数'
            },
            fields: {
                type: 'object',
                additionalProperties: true,
                description: '变更的字段'
            },
            modifiedData: {
                type: 'object',
                additionalProperties: true,
                description: '变更的数据'
            }
        }
    };
    export interface CreateResourcePayload {
        code: 3001;
        url: string;
        resType: string;
        resId: string;
        params: { [key: string]: any };
        fields: { [key: string]: any };
        modifiedData: { [key: string]: any };
    }
    export const createResource: EventSchema = {
        code: 3001,
        level: 3,
        name: "createResource",
        title: "创建资源"
    };

    // 可继续添加其他资源事件定义
}