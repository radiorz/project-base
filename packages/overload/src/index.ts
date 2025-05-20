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
func.addImpl('string', 'number', (a: string, b: number) => {
  return a + b;
});
func.addImpl('number', 'string', (a: number, b: string) => {
  return a + parseInt(b);
});
console.log(`func('1', 2);`, func('1', 2));
console.log(`func('1', 2);`, func(1, '2'));
console.log(`func({a:1}, {b:1});`, func({ a: 1 }, { b: 1 }));
