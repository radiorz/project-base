import { createConfig } from '../lib';

const config = createConfig({ a: 1, b: { c: 2 } });
config.watch('b.c', (value) => {
  console.log('b.c is changed', value);
});
console.log(`config`, config);
console.log(`b.c before changed `, config.get('b.c'));
config.set('b.c', 3);
console.log(`b.c after changed`, config.get('b.c'));
