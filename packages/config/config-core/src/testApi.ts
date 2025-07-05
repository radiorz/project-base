import { set } from 'lodash'
import { ReactiveEmitter } from '../lib/ReactiveEmitter/ReactiveEmitter'
import { wrapApi } from '../lib/ApiWrapper/api'

const r = new ReactiveEmitter({
  a: 1,
  b: {
    c: 2
  }
})


const api = wrapApi(r)
api.on('change', ({ path, value }) => {
  console.log(`path,value123123`, path, value)
})
console.log(`api.get('a')`, api.get('a'))

api.set('a', 123)
api.remove('a')
api.reset({ a: 1, b: 2 })
console.log(`api.get()`, api.get())
api.set(undefined, { a: 1, b: 3 })
console.log(`api.get()`, api.get())
