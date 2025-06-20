import { flatNestedObject } from "@tikkhun/utils-core";
import _ from 'lodash'
const { get, isEqual, set } = _
// 算法粗糙 后续可以优化
export function deepDiff(object1: Record<string, any>, object2: Record<string, any>) {
    const diff = {}
    const flatedNestedObject = flatNestedObject({
        delimiter: '.',
        data: object2
    })
    Object.entries(flatedNestedObject).forEach(([key, value]) => {
        if (isEqual(get(object1, key), value)) {
            return
        }
        set(diff, key, value)
    })
    return diff
}