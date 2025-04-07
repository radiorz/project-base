import { actionManager } from '../lib';
actionManager.createAction('action', async (ctx) => {
  console.log('action', ctx);
  if (typeof ctx?.count !== 'undefined') ctx.count++;
});
actionManager.exec('action');
actionManager.createAction('action2', async (ctx) => {
  console.log('action2', ctx);
});
const context = { count: 0 };
actionManager.exec(['action', 'action2'], { context });

