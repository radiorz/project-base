import { EventSchema } from "../event";

export namespace UserEvent {
    export const UserLoginSchema = {
        type: "object",
        properties: {
            code: {
                type: 'number',
                const: 6000,
                description: '用户登录事件编码'
            }
        }
    };
    export interface UserLoginPayload {
        code: 6000;
    }
    export const userLogin: EventSchema = {
        code: 6000,
        level: 3,
        name: "userLogin",
        title: "用户登录"
    };

    export const UserLogoutSchema = {
        type: "object",
        properties: {
            code: {
                type: 'number',
                const: 6001,
                description: '用户登出事件编码'
            }
        }
    };
    export interface UserLogoutPayload {
        code: 6001;
    }
    export const userLogout: EventSchema = {
        code: 6001,
        level: 3,
        name: "userLogout",
        title: "用户登出"
    };
}