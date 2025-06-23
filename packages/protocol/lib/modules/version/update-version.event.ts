import { EventSchema } from '@tikkhun/protocol-core';

export const updateVersionEvent: EventSchema = {
  code: '',
  name: '升级进度',
  description: '升级进度事件',
  payloadSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        title: '消息',
        description: '升级消息',
      },
    },
    required: ['progress'],
  },
};
