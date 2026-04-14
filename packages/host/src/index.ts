import { HostNode } from '../lib';

const adapter = {
  publish(topic: string, message: any) {
    console.log('publish', topic, message);
  },
  subscribe(topic: string, handler: (topic: string, message: any) => void) {
    console.log('subscribe', topic);
    setTimeout(() => {
      handler('host/host-1/control.invoke', {
        type: 'control.invoke',
        ts: Date.now(),
        from: 'peer-1',
        to: 'host-1',
        payload: { capability: 'system', method: 'ping', args: [] },
      });
    }, 10);
    return () => console.log('unsubscribe', topic);
  },
};

const node = new HostNode({ id: 'host-1', name: 'demo-host', adapter, managerEnabled: true });
node.host.registerCapability({
  name: 'system',
  methods: {
    ping() {
      return 'pong';
    },
  },
});

node.start();
