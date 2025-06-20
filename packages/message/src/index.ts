import { minifyMessage, normalizeMessage } from '../lib';
const normalizedMessage = normalizeMessage({
  payload: { a: 1 },
});
console.log(`normalizedMessage`, normalizedMessage);

const minifiedMessage = minifyMessage(normalizedMessage);
console.log(`minifiedMessage`, minifiedMessage);
