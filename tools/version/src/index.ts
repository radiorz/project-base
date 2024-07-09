import { SemanticVersionGetter } from '../lib';

async function bootstrap() {
  const getter = new SemanticVersionGetter();
  const version = await getter.get();

  console.log(`version`, version);
}
bootstrap();
