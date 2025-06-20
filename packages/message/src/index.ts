import { minifyMessage, normalizeMessage } from '../lib';
const normalizedMessage = normalizeMessage({
  type: '123',
  payload: { a: 1 },
  flags: {
    qos: 1
  }
});
console.log(`normalizedMessage`, normalizedMessage);

const minifiedMessage = minifyMessage(normalizedMessage);
console.log(`minifiedMessage`, minifiedMessage);
