import { BinaryActionManager } from '../../lib/BinaryActionManager';
import { MorseCodeStrategy } from '../../lib/BinaryActionManager';
import { ActionManager, actionManager } from '../../lib/ActionManager';
import { MORSE_CODE_MAP } from '../../lib/BinaryActionManager/strategies/MorseCodeStrategy';

class MorseCodeInput {
  private binaryManager: BinaryActionManager;
  private currentText: string = '';
  private actionManager = new ActionManager();
  constructor() {
    this.binaryManager = new BinaryActionManager({ actionManager: this.actionManager });
    this.initializeMorseCode();
    this.actionManager.createAction('morseInput', (context) => {
      this.currentText += context.value;
    });
  }

  private initializeMorseCode() {
    const morseStrategy = new MorseCodeStrategy();
    this.binaryManager.addStrategy(morseStrategy);

    this.binaryManager.bind('morseInput', 'input1', morseStrategy.type);
  }

  press() {
    this.binaryManager.onMessage({
      from: 'input1',
      value: 1,
      triggerTime: Date.now(),
    });
  }

  release() {
    this.binaryManager.onMessage({
      from: 'input1',
      value: 0,
      triggerTime: Date.now(),
    });
  }
  getText() {
    return this.currentText;
  }
}

// 测试代码
const morseInput = new MorseCodeInput();

// 模拟输入字母 "A" (.- 摩斯密码)
async function testInput() {
  // H (...)
  for (let i = 0; i < 4; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 100));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 字母间隔

  // E (.)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // L (.-..)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 800));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 100));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // L (.-..)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 800));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 100));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // O (---)
  for (let i = 0; i < 3; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 800));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 单词间隔

  // W (.--)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 800));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // O (---)
  for (let i = 0; i < 3; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 800));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // R (.-.)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 800));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // L (.-..)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 800));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 100));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // D (-..)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, 800));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, 200));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, 100));
    morseInput.release();
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

testInput().then(() => {
  console.log('输入完成:', morseInput.getText());
});
