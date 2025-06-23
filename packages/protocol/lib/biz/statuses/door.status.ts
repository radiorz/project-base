import { StatusCategory } from "../status";

export const DoorStatusCategory: StatusCategory = {
    default: 0,
    enumDict: [{
        value: 0,
        name: '空闲',
        description: '空闲'
    }, {
        value: 1,
        name: '休眠中',
        description: '休眠中'
    }],
    name: ""
}
// 1
// 门已关2
// 关门中3
// 门已开4
// 开门中5
// 门异常
export const DoorStatus = {
    /**
     * 关
     */
    closed: 0,

    /**
     * 正在关
     */
    closing: 1, // 
    open: 2,
    /**
     * 正在开
     */
    opening: 3,
    /**
     * 异常
     */
    error: 5
}