import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './config/db.config';
import { UserModule } from './user/user.module';
import { EnvConfigModule } from './config/env.config';
import { MathServiceClientModule } from './config/microservice.config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Module({
  imports: [EnvConfigModule, DbModule, UserModule, MathServiceClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    @Inject('MATH_SERVICE')
    private client: ClientProxy,
  ) {
    console.log(`this.client`, this.client);
    this.client?.emit('user_created', {});
    this.dosomething();
  }
  async dosomething() {
    const observable = this.client?.send({ cmd: 'sum' }, [1, 2, 3]);
    const result = await firstValueFrom(observable);
    console.log(`result`, result);
  }
}
