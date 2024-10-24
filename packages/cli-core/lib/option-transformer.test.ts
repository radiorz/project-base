import { it, expect } from 'vitest';
import { OptionTransformer } from './option-transformer';
it('option handler ', async () => {
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
  const types = {
    boolean: 'boolean',
    a: 'number',
    b: 'array',
    c: {
      d: 'number',
      f: 'string',
      e: 'boolean',
      g: {
        h: 'string',
      },
    },
  };
  const typedObj = OptionTransformer.parse(originValue, types);
  console.log(`typedObj`, typedObj);
  const stringObj = OptionTransformer.stringify(typedObj);
  console.log(`stringObj`, stringObj);
});
