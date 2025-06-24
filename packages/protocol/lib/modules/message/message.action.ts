import { ActionSchema, ActionSubType, MessageType } from '@tikkhun/protocol-core';

export const messageAction: ActionSchema = {
  type: MessageType.action,
  subType: ActionSubType.request,
  name: 'message',
  title: '通知消息',
  description: '通知消息',
  payloadSchema: {
    type: 'object',
    properties: {
      // 通知名称
      name: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      icon: {
        type: 'string',
      },
    },
    required: ['name', 'content'],
  },
};
