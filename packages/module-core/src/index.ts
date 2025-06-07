import { Module } from '../lib';

const moduleA = new Module({ name: 'moduleA' });
const moduleB = new Module({ name: 'moduleB' });
moduleA.connect(moduleB);
moduleB.emitter.on('*', (data) => {
  console.log(`data`, data);
});
moduleA.emit('123', { message: 'Hello from moduleA' });
