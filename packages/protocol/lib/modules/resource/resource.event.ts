import { createEventSchema } from '@tikkhun/protocol-core';

export namespace ResourceEvent {
  export const ResourcePayloadSchema = {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: '资源 url',
      },
      resType: {
        type: 'string',
        description: '资源类型',
      },
      resId: {
        type: 'string',
        description: '资源 id',
      },
      params: {
        type: 'object',
        additionalProperties: true,
        description: '参数',
      },
      fields: {
        type: 'object',
        additionalProperties: true,
        description: '变更的字段',
      },
      modifiedData: {
        type: 'object',
        additionalProperties: true,
        description: '变更的数据',
      },
    },
  };

  export interface ResourcePayload {
    type: string;
    id: string;
    name?: string;
    url?: string;
    /**
     * 参数
     */
    params: { [key: string]: any };
    /**
     * 变更的字段
     */
    fields: { [key: string]: any };
    /**
     * 变更的数据
     */
    modifiedData: { [key: string]: any };
  }

  enum ResourceEventCode {
    createResource = 3001,
    updateResource,
    deleteResource,
    pushResource,
    popResource,
    changeResource,
    monotonicResource,
    swapResource, // 对调
  }

  export const createResource = createEventSchema({
    code: ResourceEventCode.createResource,
    level: 3,
    name: 'createResource',
    title: '创建资源',
  });

  export const updateResource = createEventSchema({
    code: ResourceEventCode.updateResource,
    level: 3,
    name: 'updateResource',
    title: '更新资源',
  });

  export const deleteResource = createEventSchema({
    code: ResourceEventCode.deleteResource,
    level: 3,
    name: 'deleteResource',
    title: '删除资源',
  });

  export const pushResource = createEventSchema({
    code: ResourceEventCode.pushResource,
    level: 3,
    name: 'pushResource',
    title: '压入资源',
  });

  export const popResource = createEventSchema({
    code: ResourceEventCode.popResource,
    level: 3,
    name: 'popResource',
    title: '弹出资源',
  });

  export const changeResource = createEventSchema({
    code: ResourceEventCode.changeResource,
    level: 3,
    name: 'changeResource',
    title: '变更资源',
  });

  export const monotonicResource = createEventSchema({
    code: ResourceEventCode.monotonicResource,
    level: 3,
    name: 'monotonicResource',
    title: '单调资源',
  });

  export const swapResource = createEventSchema({
    code: ResourceEventCode.swapResource,
    level: 3,
    name: 'swapResource',
    title: '对调资源',
  });
}
