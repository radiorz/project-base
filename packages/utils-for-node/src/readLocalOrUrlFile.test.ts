import { readFile } from 'fs/promises';
import { URL } from 'url';
import { isUrlString } from 'url-or-path';
async function bootstrap() {
  const thePath = 'file://raw.githubusercontent.com/zhangfisher/flex-tools/master/package.json';
  console.log(`isUrlString(thePath)`, isUrlString(thePath));
  const content = await readFile(new URL(thePath), 'utf-8');
  console.log(`content`, content);
}
bootstrap();
