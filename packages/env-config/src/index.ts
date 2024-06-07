import { DEFAULT_ENV_MANAGER, EnvManager } from '../lib';
console.log(`env`, DEFAULT_ENV_MANAGER.get());
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: 'C.C.C' }));
console.log(`env`, DEFAULT_ENV_MANAGER.get('c.c.c'));

const envManager = EnvManager.create({
  load: [
    () => ({
      a: {
        b: {
          c: 111,
        },
      },
    }),
  ],
});
console.log(`envManager.get()`, envManager.get('a.b.c'));
