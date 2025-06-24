import { createEventSchema } from '@tikkhun/protocol-core';

export namespace UserEvent {
  export const UserPayloadSchema = {
    type: 'object',
    properties: {
      // 文档中没有额外字段，所以为空
    },
  };

  export interface UserPayload {
    // 没有额外字段
  }

  export enum UserEventCode {
    login = 6000,
    logout = 6001,
  }

  export const userLogin = createEventSchema({
    code: UserEventCode.login,
    level: 3,
    name: 'userLogin',
    title: '用户登录',
  });

  export const userLogout = createEventSchema({
    code: UserEventCode.logout,
    level: 3,
    name: 'userLogout',
    title: '用户登出',
  });
}
