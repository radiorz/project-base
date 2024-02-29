import { ConfigModule } from '@nestjs/config';
console.log(`process.env.NODE_ENV`, process.env.NODE_ENV);
const nodeEnv = process.env.NODE_ENV?.trim();
// console.log(`.env.${nodeEnv}.local`);
export const EnvConfigModule = ConfigModule.forRoot({
  // 指定存储环境变量的文件, 靠前的文件拥有较高的优先级
  envFilePath: [`.env.${nodeEnv}.local`, `.env.${nodeEnv}`, '.env'],
  isGlobal: true,
}); // 全局导入 ConfigModule
