import { EventSchema } from "./event";

export const upgradeProgressEvent: EventSchema = {
  name: '升级进度',
  description: '升级进度事件',
  code: 201,
  payloadSchema: {
    type: 'object',
    properties: {
      progress: {
        type: 'number',
        title: '进度',
        description: '升级进度',
      },
      message: {
        type: 'string',
        title: '消息',
        description: '升级消息',
      }
    },
    required: ['progress'],
  },
}
