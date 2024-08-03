import { App } from '../lib';
const app = new App();
app.useEffect(function (c) {
  c.a = 1;
  console.log(`1.s`, c);
  const a = 123;
  return function (c) {
    console.log(`a`, a);
    c.a = 2;
    console.log(`1.b`, c);
  };
});
app.useEffect(function (c) {
  c.b = 1;
  const nnn = 123;
  console.log(`2.s`, c);
  return (c) => {
    c.b = 2;
    console.log(`nnn`, nnn);
    console.log(`2,b`, c);
  };
});
async function bootstrap() {
  const context = { a: 1 };
  const result = await app.handle(context);
  console.log(`result`, result);
}
bootstrap();
