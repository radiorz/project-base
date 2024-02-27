import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { configSwagger } from './config/swagger.config';
import helmet from 'helmet';

function applyHelmet(app) {
  // 防止 @apollo/server等不行用
  const options = {
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [
          `'self'`,
          'data:',
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [
          `'self'`,
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  };
  app.use(helmet(options));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  // api 开头
  app.setGlobalPrefix('api');
  configSwagger(app);
  applyHelmet(app);
  await app.listen(3000);
}

bootstrap();
