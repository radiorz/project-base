import Express from 'express';
const app = Express();
app.get('/', (req, res) => {
  res.send('hello');
});
app.listen(3000, () => {
  console.log(`1111111111`, 1111111111);
});
