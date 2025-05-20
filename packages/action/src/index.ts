import { createActionMgr } from '../lib';

const actionMgr = createActionMgr();
actionMgr.set('add', (a: number, b: number) => a + b);
actionMgr.set('sub', (a: number, b: number) => a - b);
console.log(actionMgr.do('add', 1, 2)); // 3
console.log(actionMgr.get('add')?.(1, 2)); // -1
console.log(actionMgr.get('sub')?.(1, 2)); // -1
