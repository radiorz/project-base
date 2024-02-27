import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const GlobalConfigModule = ConfigModule.forRoot({
  // 指定存储环境变量的文件, 靠前的文件拥有较高的优先级
  envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
  isGlobal: true,
}); // 全局导入 ConfigModule

/* export const DbModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [UserEntity],
  synchronize: true,
}); */

@Module({
  imports: [GlobalConfigModule /* , DbModule */, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    console.log(`this.configService.get('TOKEN_SECRET');`, this.configService);
  }
}
