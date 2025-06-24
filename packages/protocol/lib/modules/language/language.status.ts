import { StatusCategory } from "../status"

export const languageStatusCategory: StatusCategory = {
    name: 'language',
    default: 'zh-CN',
    values: [
        {
            name: 'zh-CN',
            value: 'zh-CN',
        },
        {
            name: 'en-US',
            value: 'en-US',
        },
        {
            name: "zh-TW",
            value: 'zh-TW'
        }
    ]

}