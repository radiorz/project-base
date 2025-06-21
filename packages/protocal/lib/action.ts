import { Description } from "./consts";
// 对动作的定义
export interface ActionSchema extends Description {
  paramSchema: Record<string, any>;
}
// 真正下发的动作数据
export interface Action {
  name: string; // 名称
  level: number; // 等级
  params: Record<string, any>; // 参数
}
export const notifyAction: ActionSchema = {
  name: 'notify',
  title: '通知',
  description: '通知',
  paramSchema: {
    message: {
      type: 'string',
      title: '通知',
      description: '通知',
    },
  },
}
export const messageAction: ActionSchema = {
  name: 'message',
  title: '消息',
  description: '消息',
  paramSchema: {
    message: {
      type: 'string',
      title: '消息',
      description: '消息',
    },
  },
}
export const dataAction: ActionSchema = {
  name: 'data',
  title: '数据',
  description: '数据',
  paramSchema: {
    data: {
      type: 'string',
      title: '数据',
      description: '数据',
    },
  },
}
// 或者叫 query
export const requestAction: ActionSchema = {
  name: 'request',
  title: '请求',
  description: '请求',
  paramSchema: {
    query: {
      type: 'object',
      title: '请求',
      description: '请求',
    },
  },
}
// 或者叫 answer
export const responseAction: ActionSchema = {
  name: 'response',
  title: '响应',
  description: '响应',
  paramSchema: {
    response: {
      type: 'string',
      title: '响应',
      description: '响应',
    },
  },
}
// 注册
export const registerAction: ActionSchema = {
  name: 'register',
  title: '注册',
  description: '注册',
  paramSchema: {
    name: {
      type: 'string',
      title: '名称',
      description: '名称',
    },
  },
}
