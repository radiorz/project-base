import { DEFAULT_ENV_MANAGER, ConfigManager, EnvSource } from '../lib';
console.log(`env`, DEFAULT_ENV_MANAGER.get());
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: 'c.c.c' }));
console.log(`env`, DEFAULT_ENV_MANAGER.get('c.c.c'));

const m = ConfigManager.create({
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
console.log(`envManager.get()`, m.get('a.b.c'));
m.addSource({
  load() {
    return { nnn: '123' };
  },
});
console.log(`m.get('nnn')`, m.get('nnn'));
