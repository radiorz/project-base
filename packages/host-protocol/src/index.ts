import { createHostProtocol } from '../lib';

const protocol = createHostProtocol();
console.log(protocol.topic.broadcast('register'));
console.log(protocol.topic.to('host-1', 'config.get'));
