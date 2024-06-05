import { DEFAULT_ENV_MANAGER } from '../lib';
console.log(`env`, DEFAULT_ENV_MANAGER.get());
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: 'c.c.c' }));
console.log(`env`, DEFAULT_ENV_MANAGER.get('c.c.c'));
