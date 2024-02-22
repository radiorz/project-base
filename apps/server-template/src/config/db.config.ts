import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from '../user/entities/user.entity';
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
