import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { hello } from 'common';
console.log(`hello`, hello);
import { checkPathExists } from 'utils';

async function bootstrap() {
  const result = await checkPathExists(
    'G:\\szk\\code\\project-base\\apps\\server-template\\src',
  );
  console.log(`result`, result);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
