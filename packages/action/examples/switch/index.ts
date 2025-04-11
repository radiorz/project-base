/*
 * @FilePath: \project-base\packages\action\examples\switch\index.ts
 * @Author: zk.su
 * @Date: 2025-04-07 15:16:35
 * @LastEditTime: 2025-04-07 15:27:45
 * @LastEditors: zk.su
 * @Description: 
 * @TODO: 
 */
import { Observable } from 'rxjs/internal/Observable';
import { ActionManager } from '../../lib/ActionManager';
import { BinaryActionManager, BinaryMessage, IOStrategy } from '../../lib/BinaryActionManager';
import { map } from 'rxjs/internal/operators/map';

// 开关策略
class SwitchStrategy implements IOStrategy {
  type = 'SWITCH';

  // 使用 RxJS Observable 处理二进制消息流
  // @param messages - 二进制消息的 Observable 流
  // @returns 处理后的字符串状态 Observable 流
  handle(messages: Observable<BinaryMessage>): Observable<string> {
    return messages.pipe(
      // 使用 map 操作符将二进制值(1/0)转换为状态字符串(ON/OFF)
      map(msg => msg.value === 1 ? 'ON' : 'OFF')
    );
  }
}

class SwitchControl {
  private binaryManager: BinaryActionManager;
  private currentState: string = 'OFF';
  private actionManager = new ActionManager();
  private inputName = 'switch1';

  constructor() {
    this.binaryManager = new BinaryActionManager({ actionManager: this.actionManager });
    this.initializeSwitch();
    this.actionManager.createAction('switchState', (context) => {
      this.currentState = context.value;
      console.log('Switch state changed to:', this.currentState);
    });
  }

  private initializeSwitch() {
    const switchStrategy = new SwitchStrategy();
    this.binaryManager.addStrategy(switchStrategy);
    this.binaryManager.bind('switchState', this.inputName, switchStrategy.type);
  }

  turnOn() {
    this.binaryManager.onMessage({
      from: this.inputName,
      value: 1,
      triggerTime: Date.now(),
    });
  }

  turnOff() {
    this.binaryManager.onMessage({
      from: this.inputName,
      value: 0,
      triggerTime: Date.now(),
    });
  }

  getState() {
    return this.currentState;
  }
}

// 测试代码
async function testSwitch() {
  const switchControl = new SwitchControl();

  console.log('Initial state:', switchControl.getState());

  // 测试开关切换
  await switchControl.turnOn();
  console.log('After turn on:', switchControl.getState());


  await switchControl.turnOff();
  console.log('After turn off:', switchControl.getState());


  // 快速切换测试
  console.log('Testing rapid switching...');
  for (let i = 0; i < 3; i++) {
    await switchControl.turnOn();
    await switchControl.turnOff();
  }
}

// 运行测试
testSwitch().then(() => {
  console.log('Switch test completed');
});
