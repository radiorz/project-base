import { DepsVersionGetter } from '../lib';

async function bootstrap() {
  const depsVersion = new DepsVersionGetter({
    showNotNeedChanged: false,
  });
  const v = await depsVersion.get();
  console.log(`v`, JSON.stringify(v, null, 2));
}
bootstrap();
