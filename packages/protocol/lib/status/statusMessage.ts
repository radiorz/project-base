// 状态变更message

import { Message, MessageType } from "../core/message";

export interface StatusMessage extends Message {
    type: MessageType.status,
    meta: Message['meta'] & {
        qos: 2;
        retain: true;
    }
    payload: {
        code: number; // 状态编码
        level: number; // 等级
        message?: string; // 消息
        status: Record<string, any> // 比如 { calling: true,  online: false }
    }
}