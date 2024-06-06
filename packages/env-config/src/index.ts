import { DEFAULT_ENV_MANAGER } from '../lib';
console.log(`env`, DEFAULT_ENV_MANAGER.get());
console.log(`env`, DEFAULT_ENV_MANAGER.get({ path: 'C.C.C' }));
console.log(`env`, DEFAULT_ENV_MANAGER.get('c.c.c'));
