import EventBus from '../lib';

const bus = new EventBus();

console.log('=== EventBus 示例 ===\n');

// 先订阅一些事件
bus.on('user.login', (user) => {
  console.log(`  用户登录: ${user.name}`);
});
bus.on('user.*', (data) => {
  console.log(`  用户事件:`, data);
});
bus.on('**', (data) => {
  console.log(`  全局事件:`, data);
});
bus.on('order.created', (order) => {
  console.log(`  订单创建: ${order.id}`);
});
bus.once('app.start', () => {
  console.log(`  应用启动`);
});

// 打印树结构
console.log('📊 订阅后的 Radix Tree 结构:');
bus.printTree();

console.log('---');

// 测试触发
console.log('🎯 触发事件:');
bus.emit('user.login', { name: 'Alice' });
bus.emit('user.logout', { name: 'Alice' });
bus.emit('order.created', { id: '123' });
