import { Config } from '../lib';

async function bootstrap() {
  const m = await Config.create({
    sources: [
      {
        load() {
          return {
            arr: [],
            a: {
              b: {
                c: 111,
              },
            },
          };
        },
        save() {
          console.log(`12231`, 12231)
        }
      },
    ],
  });
  // m.on(ConfigEvents.change, (config) => {
  //   console.log(`config change`, config);
  // });
  m.on('change', ({ path, value }) => console.log(`onvaluechange path,value`, path, value));
  m.set('a', 'bbb')
  // console.log(`获取全部 m.get()`, m.get());
  // // console.log(`m.get()`, JSON.stringify(m.get()));
  // console.log(`通过路径获取 m.get('a.b.c')`, m.get('a.b.c'));
  // await m.addSource({
  //   load() {
  //     return { nnn: '123', mmm: '123' };
  //   },
  // });
  // // console.log(`添加源 m.get('nnn')`, m.get('nnn'));
  // console.log(`修改nnn为 1234`);
  // m.set('nnn', '1234');
  // console.log(`修改nnn为 1234后 m.get('nnn')`, m.get('nnn'));
  // await m.reset();
  // console.log(`m.config`, m.config);

}
bootstrap();
