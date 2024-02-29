import { NestApplicationOptions } from '@nestjs/common';

export const appConfig: NestApplicationOptions = {
  cors: true,
};

export function applyPrefix(app) {
  app.setGlobalPrefix('api');
}
