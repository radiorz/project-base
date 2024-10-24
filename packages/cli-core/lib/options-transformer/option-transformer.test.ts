import { it, expect } from 'vitest';
import { OptionsTransformer } from './options-transformer';
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
  const typedObj = OptionsTransformer.parse(originValue, types);
  console.log(`typedObj`, typedObj);
  const stringObj = OptionsTransformer.stringify(typedObj);
  console.log(`stringObj`, stringObj);
});
