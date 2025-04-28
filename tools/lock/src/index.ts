import { generateKey, isValidPassword } from '../lib';

async function bootstrap() {
  const result = await generateKey('123456');

  console.log(`result`, result);
  console.log(`isValidPassword("123456")`, await isValidPassword('123456', result.secret));
  console.log(`isValidPassword("1234567")`, await isValidPassword('1234567', result.secret));
}
bootstrap();
