import { ActionSchema } from '@tikkhun/protocol-core';

export const upgradeActionSchema: ActionSchema = {
  name: 'updateVersion',
  description: '升级设备',
  payloadSchema: {
    type: 'object',
    properties: {
      version: {
        type: 'string',
        title: '版本',
        description: '升级版本',
      },
      url: {
        type: 'string',
        title: '下载地址',
        description: '下载地址',
      },
      md5: {
        type: 'string',
        title: 'MD5',
        description: '文件MD5值',
      },
    },
    required: ['url'],
  },
};

export interface UpgradePayload {
  url: string;
  version?: string;
  md5?: string;
}
