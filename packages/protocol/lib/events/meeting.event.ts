import { EventSchema } from "../core/event/event";

export namespace MeetingEvent {
    // 可根据实际协议补充会议事件定义
    // 目前协议中会议事件未详细展开，这里预留框架
    export const MeetingEventPlaceholderSchema = {
        type: "object",
        properties: {
            code: {
                type: 'number',
                description: '会议事件编码'
            }
        }
    };
    export interface MeetingEventPlaceholderPayload {
        code: number;
    }
    export enum MeetingEventCode {
        start = 5000
    }
    export const meetingEventPlaceholder: EventSchema = {
        code: MeetingEventCode.start,
        name: "meetingEventPlaceholder",
        title: "会议事件占位符"
    };
}