import { DEFAULT_ENV_MANAGER, Config, EnvSource } from '../lib';
// console.log(`env`, DEFAULT_ENV_MANAGER.get());
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: 'c.c.c' }));
console.log(`env`, DEFAULT_ENV_MANAGER.get('c.c.c'));

const m = Config.create({
  sources: [
    new EnvSource(),
    {
      load() {
        return {
          a: {
            b: {
              c: 111,
            },
          },
        };
      },
    },
  ],
});
m.on('change', (config: any) => console.log('change', config.nnn));
console.log(`envManager.get()`, m.get('a.b.c'));
m.addSource({
  load() {
    return { nnn: '123' };
  },
});
m.set('nnn', '1234');
console.log(`m.get('nnn')`, m.get('nnn'));

const v = Config.create({
  sources: [new EnvSource({ prefix: 'tikkhun' })],
});
console.log(`v.get()`, v.get());
