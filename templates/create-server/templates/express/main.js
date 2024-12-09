import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});
const port = 3000;
async function bootstrap() {
  app.listen(port, () => {
    console.log('启动成功，端口' + port);
  });
}
bootstrap();
