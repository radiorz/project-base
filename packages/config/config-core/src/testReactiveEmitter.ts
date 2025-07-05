import { set } from 'lodash'
import { ReactiveEmitter } from '../lib/ReactiveEmitter/ReactiveEmitter'

const r = new ReactiveEmitter({
  a: 1,
  b: {
    c: 2
  }
})
r.on('change', ({ path, value }) => {
  console.log(`path,value123123`, path, value)
})
// 变更某个值
r.reactiveValue.value.a = 2
// 变更某个嵌套的值
r.reactiveValue.value.b.c = 3
// 全局变更
r.reactiveValue.value = {
  a: 1, b: {
    c: 2134
  }
}
set(r.reactiveValue.value, 'a', 123)
set(r.reactiveValue.value, 'b.c', 123)

