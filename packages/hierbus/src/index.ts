import { Eventbus } from '../lib';

const eventbus = new Eventbus();
const a = eventbus.createNode({ name: 'a' });
const b = eventbus.createNode({ name: 'a/b' });

a.join(b);

b.on('ping', (value, ctx) => {
  console.log('b received', value, ctx);
});

a.emit('ping', 1);
