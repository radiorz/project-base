import { expect, describe, test } from 'vitest';
import { jsonToList, ListItem, listToJson } from './listToJson';
describe('listToJson', () => {
  test('converts list to JSON object', () => {
    const list: ListItem[] = [
      { key: 'foo.bar', value: 1 },
      { key: 'foo.baz', value: 2 },
      { key: 'qux', value: 3 },
    ];

    const expectedJson = {
      foo: {
        bar: 1,
        baz: 2,
      },
    };

    const options = {
      delimiter: '.',
      list,
      isKeyInclude: (key: string) => key.startsWith('foo'),
      keyItemTransformer: (key: string) => key.toLowerCase(),
    };

    const result = listToJson(options);

    expect(result).toStrictEqual(expectedJson);
  });
});

describe('jsonToList', () => {
  test('converts JSON object to list', () => {
    const json = {
      foo: {
        bar: 1,
        baz: 2,
      },
      qux: 3,
    };

    const expectedList: ListItem[] = [
      { key: 'foo.bar', value: 1 },
      { key: 'foo.baz', value: 2 },
      { key: 'qux', value: 3 },
    ];

    const options = {
      delimiter: '.',
      json,
    };

    const result = jsonToList(options);
    expect(result).toStrictEqual(expectedList);
  });
});
