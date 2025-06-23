import { StatusCategory } from "../status";
// 1
// 门已关2
// 关门中3
// 门已开4
// 开门中5
// 门异常
export enum DoorStatus {
    /**
     * 异常
     */
    error = 0,
    /**
     * 关
     */
    closed,

    /**
     * 正在关
     */
    closing,
    /**
     * 开着
     */
    open,
    /**
     * 正在开
     */
    opening,
}
export const DoorStatusCategory: StatusCategory = {
    default: 0,
    name: "door",
    values: [
        {
            value: DoorStatus.error,
            name: 'error',
            description: '出错'
        },
        {
            value: DoorStatus.closed,
            name: 'closed',
            description: '关'
        },
        {
            value: DoorStatus.closing,
            name: 'closing',
            description: '关门中'
        },
        {
            value: DoorStatus.open,
            name: 'open',
            description: '关'
        },
        {
            value: DoorStatus.opening,
            name: 'opening',
            description: '开门中'
        },
    ],
}
