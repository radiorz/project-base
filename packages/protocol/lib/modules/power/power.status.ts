import { StatusCategory } from "../status";

export const powerStatusCategory: StatusCategory = {
    default: 0,
    values: [{
        name: "on",
        value: 1,
    },
    {
        name: 'off',
        value: 0
    }],
    name: "power"
}