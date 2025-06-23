/**
 * 通知与普通消息的区别是通知孩主要是到人的传递而不是到物的传递
 * 其实可以和message 等同起来，区别还是to的id不一样而已。
 */
import { ActionSchema } from "../core/action/Action.type";

export const notifyAction: ActionSchema = {
  name: 'notify',
  title: '通知',
  description: '通知',
  payloadSchema: {
    title: {
      type: 'string',
      title: '标题',
      description: '标题',
    },
    content: {
      type: "string",
      title: "内容",
    },
  },
}
