import { ErrorManager, TkError } from '../lib';

ErrorManager.init();
try {
  throw new TkError({
    message: 'ttt.ooo',
  });
} catch (error: any) {
  console.log(`error`, error);
  console.log(`error`, error?.opts);
}
