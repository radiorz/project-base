import { Build } from '../lib';
async function bootstrap() {
  const build = new Build({
    outDir: 'test-dist',
  });
  build.start();
}
bootstrap();
