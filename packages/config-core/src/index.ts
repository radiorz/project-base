import { EnvSource } from '../dist';
import { Config } from '../lib';

const m = Config.create({
  sources: [
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
m.on('change', (config) => console.log('change', config.nnn));
console.log(`envManager.get()`, m.get('a.b.c'));
m.addSource({
  load() {
    return { nnn: '123' };
  },
});
m.set('nnn', '1234');
console.log(`m.get('nnn')`, m.get('nnn'));
