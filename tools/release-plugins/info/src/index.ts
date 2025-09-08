import { getInfo } from '../lib';
async function bootstrap() {
  const info = await getInfo({
    from: [
      [
        {
          name: 'alibaba',
        },
      ] as any,
    ],
  });
  console.log(`info`, info);
}
bootstrap();
