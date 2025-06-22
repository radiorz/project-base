import { ActionSchema } from "../Action.type";

// 或者叫 query
export const requestAction: ActionSchema = {
  name: 'request',
  title: '请求',
  description: '请求',
  payloadSchema: {
    type: "object",
    properties: {
      url: {
        type: "string"
      },
      method: {
        type: "string"
      },
      params: {
        type: 'object',
        title: '请求',
        description: '请求',
      },
    }
  },
}
