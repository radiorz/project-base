import { createOverLoad } from '../lib';
const func = createOverLoad({
  impls: [
    [
      'object',
      'object',
      (a: any, b: any) => {
        return Object.assign({}, a, b);
      },
    ],
  ],
});
func.addImpl('number', 'string', (a: number, b: string) => {
  return a + parseInt(b);
});
func.addImpl('string', ['string', 'number'], (a: any, b: any) => {
  return a + b;
});
console.log(`func('1', 2);`, func('aaa', 2));
console.log(`func('1', 2);`, func('aaa', undefined));
console.log(`func('1', 2);`, func(1, '2'));
console.log(`func({a:1}, {b:1});`, func({ a: 1 }, { b: 1 }));
