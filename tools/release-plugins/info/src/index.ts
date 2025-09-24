import { fileURLToPath } from 'url';
import { __FILE_STAT__, getInfo } from '../lib';

async function bootstrap() {
  const info = await getInfo({
    from: [
      // [
      //   {
      //     name: 'alibaba',
      //   },
      // ],
      // ['package.json'],
      [
        __FILE_STAT__,
        process.cwd()
      ]
    ],
  });
  console.log(`info`, info);
}
bootstrap();
