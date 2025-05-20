import { createOverLoad } from '../lib';
const func = createOverLoad();
func.addImpl('string', 'number', (a: string, b: number) => {
  return a + b;
});
func.addImpl('number', 'string', (a: number, b: string) => {
  return a + parseInt(b);
});
console.log(`func('1', 2);`, func('1', 2));
console.log(`func('1', 2);`, func(1, '2'));
