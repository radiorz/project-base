import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
export const DbModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [UserEntity],
  synchronize: true,
});
@Module({
  imports: [DbModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
