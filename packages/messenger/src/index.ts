import { Messenger } from '../lib';
import { nanoid } from 'nanoid';

export const voerkaMessenger = new Messenger({
  name: 'voerkaMessenger',
  debug: true, // 日志
  up: {
    immediately: true, // 立即启动
    broker: 'tcp://192.168.111.172:1883',
    // broker: 'ws://iot.huanyutong.com:8090/mqtt',
    clientId: 'voerka-visiting-' + nanoid(),
    // username: 'voerka-indoor-positioning',
    // password: '834624a480af5c8f5c88305f23f9866f',
  },
  onMessage(topic: string, message: any) {
    console.log('接收到消息', topic, message);
  },
  doSubscribe() {
    console.log(`doSubscribe`,)
    voerkaMessenger.subscribe('/voerka/hispro/+/groups/default/#');
  },
});
// console.log(`voerkaMessenger`, voerkaMessenger);
