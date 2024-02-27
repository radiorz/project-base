import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './config/db.config';
import { UserModule } from './user/user.module';
import { EnvConfigModule } from './config/env.config';
@Module({
  imports: [EnvConfigModule, DbModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
