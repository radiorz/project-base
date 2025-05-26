import { it, expect } from 'vitest';
import { NestedArgs } from './nested-args';
import { TYPES } from './arg.type';
// typeHandlers: {
//   [TYPES.boolean]: booleanType,
//   [TYPES.number]: numberType,
//   [TYPES.string]: stringType,
//   [TYPES.array]: arrayType,
//   [TYPES.keyValueArray]: keyValueArrayType,
//   [TYPES.json]: jsonType,
//   [TYPES.object]: objectType,
//   [TYPES.objectArray]: objectArrayType,
// },
it('nested ars', async () => {
  const stringifiedValues = {
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
  const parsedValues = {
    boolean: true,
    number: 123,
    string: 'string',
    array: [1, 2, 3],
    keyValueArray: [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
      { key: 'c', value: 3 },
    ],
    json: { a: 1, b: 2, c: 3 },
    object: { a: 1, b: 2, c: 3 },
    objectArray: [
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 2, c: 3 },
    ],
    nested: {
      boolean: true,
      number: 123,
      string: 'string',
      array: [1, 2, 3],
      keyValueArray: [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ],
      json: { a: 1, b: 2, c: 3 },
      object: { a: 1, b: 2, c: 3 },
      objectArray: [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
      ],
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
  const options = NestedArgs.parse(stringifiedValues, { schema });
  expect(options).toEqual(parsedValues);
  expect(NestedArgs.stringify(parsedValues, { schema })).toEqual(stringifiedValues);
});
