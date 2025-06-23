export interface Resource {
    type: string;
    name: string;
}
export const ResourceSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
    },
    required: ['type', 'name']
}