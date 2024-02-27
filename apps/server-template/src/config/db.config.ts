import { TypeOrmModule } from '@nestjs/typeorm';
// import { User as UserEntity } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
export const DbModule = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => {
    return {
      type: configService.get('DB_TYPE'),
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      autoLoadEntities: true,
      // entities: '../src/**/*.entities.ts',
      // entities: [UserEntity],
      synchronize: true,
    } as TypeOrmModule;
  },
  inject: [ConfigService],
});
