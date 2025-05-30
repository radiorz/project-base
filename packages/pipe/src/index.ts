import { asyncPipe } from '../lib';

async function bootstrap() {
  const result = await asyncPipe(
    async (x: any) => {
      const timeout = 1000;
      await new Promise((resolve) => setTimeout(resolve, timeout));
      return x + 1;
    },
    (x: any) => x + 2,
  )(1);
  console.log(`result`, result);
}
bootstrap();
