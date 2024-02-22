import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { configSwagger } from './config/swagger.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  // api 开头
  app.setGlobalPrefix('api');
  configSwagger(app);
  await app.listen(3000);
}
bootstrap();
