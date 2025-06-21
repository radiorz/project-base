export const mqttSchema = {
    type: 'object',
    properties: {
        broker: {
            type: "string",
        },
        username: {
            type: "string"
        },
        password: {
            type: 'string'
        },
        // 插值算法的topics
        topics: {
            type: 'array'
        }
    }
}
export interface mqttConfig {
    broker: string;
    username: string;
    password: string;
    topics: string[];
}