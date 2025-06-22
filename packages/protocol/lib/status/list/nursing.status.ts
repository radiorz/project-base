import { StatusCategory } from "../status";

export const NursingStatusCategory: StatusCategory = {
    default: 0,
    enumDict: [{
        value: 0,
        name: '空闲',
        description: '空闲'
    }, {
        value: 1,
        name: '护理中',
        description: '护理中'
    }],
    name: ""
}
export const NursingStatus = {
    /**
     * 空闲
     */
    idle: 0,
    /**
     * 通话中
     */
    nursing: 1, // 方向一个呼入一个呼出
}