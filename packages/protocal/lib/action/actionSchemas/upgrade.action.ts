import { ActionSchema } from "../Action.type";

export const upgradeActionSchema: ActionSchema = {
  name: '升级',
  description: '升级设备',
  paramSchema: {
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
        description: "下载地址"
      },
    },
    required: ['version'],
  },
}
