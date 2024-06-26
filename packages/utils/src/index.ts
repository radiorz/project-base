import { isInstalled } from '../lib/cli';
async function bootstrap() {
  console.log(`await isInstalled()`, await isInstalled('7z'));
  console.log(`await isInstalled()`, await isInstalled('7zz'));
}
bootstrap();
