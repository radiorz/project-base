import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(
    `process.env.MICROSERVICE_SERVER_PORT`,
    process.env.MICROSERVICE_SERVER_PORT,
  );
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: parseInt(process.env.MICROSERVICE_SERVER_PORT, 10) || 23001,
      },
    },
  );
  await app.listen();
}
bootstrap();
