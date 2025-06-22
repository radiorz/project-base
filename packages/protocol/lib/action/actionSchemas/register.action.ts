import { Endpoint } from "../../endpoint";
import { Message } from "../../core/message";
import { ActionSchema } from "../Action.type";

// 注册
export const registerAction: ActionSchema = {
  name: 'register',
  title: '注册',
  description: '向平台注册',
  payloadSchema: {
    type: 'object',
    properties: {
      id: {
        type: "string",
      },
      name: {
        type: 'string',
        title: '名称',
        description: '名称',
      },
      type: {
        type: 'string',
      }
    }
    ,
    required: [
      'id'
    ]

  },
}

export interface RegisterPayload extends Omit<Endpoint, 'config'> {

}


export interface RegisterResponse extends Message {
  meta: Message['meta'] & {
    response: boolean // 应答
  },
  payload: {
    domain: string
    groups: string[]


    // 好像没有必要的
    orgId: string;
    appId: string;
    workerId: string; // ?
    server: {
      host: string,
      post: string,
      auth: any
    },
    sip: {


    }
  }
}
