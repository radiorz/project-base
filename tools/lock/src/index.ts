import { generateKey, isValidPassword } from '../lib';

async function bootstrap() {
  // 生成秘钥
  const result = await generateKey('123456');

  console.log(`result`, result);
  // 校验密码
  console.log(`isValidPassword("123456")`, await isValidPassword('123456', result.secret));
  // 校验密码
  console.log(`isValidPassword("1234567")`, await isValidPassword('1234567', result.secret));
}
bootstrap();
