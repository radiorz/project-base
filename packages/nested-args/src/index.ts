import { NestedArgs, TYPES } from '../lib';

const args = {
  boolean: 'true',
  number: '123',
  string: 'string',
  array: '1,2,3',
  keyValueArray: 'a=1,b=2,c=3',
  json: '{"a":1,"b":2,"c":3}',
  object: '{"a":1,"b":2,"c":3}',
  objectArray: '[{"a":1,"b":2,"c":3},{"a":1,"b":2,"c":3}]',
  nested: {
    boolean: 'true',
    number: '123',
    string: 'string',
    array: '1,2,3',
    keyValueArray: 'a=1,b=2,c=3',
    json: '{"a":1,"b":2,"c":3}',
    object: '{"a":1,"b":2,"c":3}',
    objectArray: '[{"a":1,"b":2,"c":3},{"a":1,"b":2,"c":3}]',
  },
};
const schema = {
  boolean: TYPES.boolean,
  number: TYPES.number,
  string: TYPES.string,
  array: TYPES.array,
  keyValueArray: TYPES.keyValueArray,
  json: TYPES.json,
  object: TYPES.object,
  objectArray: TYPES.objectArray,
  nested: {
    boolean: TYPES.boolean,
    number: TYPES.number,
    string: TYPES.string,
    array: TYPES.array,
    keyValueArray: TYPES.keyValueArray,
    json: TYPES.json,
    object: TYPES.object,
    objectArray: TYPES.objectArray,
  },
};
const typedObj = NestedArgs.parse(args, { schema });
console.log(`typedObj`, typedObj);
const stringObj = NestedArgs.stringify(typedObj, { schema });
console.log(`stringObj`, stringObj);
