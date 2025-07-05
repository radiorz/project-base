import { Emitter } from "@tikkhun/utils-core";
import { ConfigValue } from "../config.type";
import { createReactiveObject } from "./reactive";
export class ReactiveEmitter<V = ConfigValue> extends Emitter {
    constructor(private value: V) {
        super()
        this.reactiveValue = createReactiveObject<{ value: V }>(
            {
                // 多嵌套一层是为了让整体更改也受监听
                value: this.value,
            },
            this.onChange.bind(this))
    }
    reactiveValue: any
    onChange(path: string, value: any) {

        path = path.replace(/^value\./, '');
        if (path === 'value') {
            path = '';
        }
        this.emit('change', { path, value });
    }
}
export function createReactiveEmitter<V = ConfigValue>(value: V) {
    return new ReactiveEmitter<V>(value)
}
