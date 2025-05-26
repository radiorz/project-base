import { NestedArgs, TYPES } from '../lib';

const originValue = {
  boolean: 'true',
  a: '123',
  b: '1,2,3',
  c: {
    d: '123',
    f: 'aaa',
    e: 'true',
    g: {
      h: '123',
    },
  },
};
const schema = {
  boolean: TYPES.boolean,
  a: TYPES.number,
  b: TYPES.array,
  c: {
    d: TYPES.number,
    f: TYPES.string,
    e: TYPES.boolean,
    g: {
      h: TYPES.string,
    },
  },
};
const typedObj = NestedArgs.parse(originValue, { schema });
console.log(`typedObj`, typedObj);
const stringObj = NestedArgs.stringify(typedObj, { schema });
console.log(`stringObj`, stringObj);
