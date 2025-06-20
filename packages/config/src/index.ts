import { createConfig } from '../lib';

const config = createConfig({ a: 1, b: { c: 2 } });
config.watch('b.c', (value: any) => {
  console.log('b.c is changed', value);
});
console.log(`config.value`, config.value);

console.log(`b.c before changed `, config.value.b.c);
config.value.a = 4;
console.log(`config.value`, config.value);
// config.set('b.c', 3);
console.log(`b.c after changed`, config.value.b.c);
config.watch('*', (path: string, value: any) => {
  console.log('* is changed', path, value);
});
config.value.b.c = 4;
