export const accessSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
        },
        url: {
            type: 'string',
            title: "下载地址"
        }
    },
    required: ['type', 'url']
}

export interface Access {
    type: string;
    url: string;
}