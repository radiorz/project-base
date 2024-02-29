import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { configSwagger } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { applyHelmet } from './config/helmet.config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    ...appConfig,
    logger,
  });
  // api 开头
  app.setGlobalPrefix('api');
  // swagger 文档
  configSwagger(app);
  // helmet
  applyHelmet(app);
  // config
  const configModule = app.get<ConfigService>(ConfigService);
  const port: number = configModule.get('HTTP_SERVER_PORT', 3000);
  // const logger = app.get(Logger); 不知道为啥这样行不通
  await app.listen(port, () => {
    // TODO 打印日志用打印日志模块
    logger.log(`启动成功,端口：${port}`);
  });
}

bootstrap();
