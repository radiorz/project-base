import { EnvSource } from '../lib';
import { Config } from '../lib';
import { removePrefix } from '../lib/EnvSource';
class TheEnvSource extends EnvSource {
  initEnv(): boolean {
    return true;
  }
  getEnv(): Record<string, any> {
    return {
      a__bbb: '666',
      a__bb: '888',
      a__cc: '777',
    };
  }
}
const m = Config.create({
  sources: [
    new TheEnvSource(),
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
console.log(`m.get()`, m.get());
// console.log(`m.get()`, JSON.stringify(m.get()));
console.log(`m.get('a.b.c')`, m.get('a.b.c'));
m.addSource({
  load() {
    return { nnn: '123' };
  },
});
m.set('nnn', '1234');
console.log(`m.get('nnn')`, m.get('nnn'));
