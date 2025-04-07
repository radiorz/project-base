import { ActionManager } from '../../lib/ActionManager';
import { BinaryActionManager, MorseCodeStrategy } from '../../lib/BinaryActionManager';

class MorseCodeInput {
  private binaryManager: BinaryActionManager;
  private currentText: string = '';
  private actionManager = new ActionManager();
  private inputName = 'input1';
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

    this.binaryManager.bind('morseInput', this.inputName, morseStrategy.type);
  }

  press() {
    this.binaryManager.onMessage({
      from: this.inputName,
      value: 1,
      triggerTime: Date.now(),
    });
  }

  release() {
    this.binaryManager.onMessage({
      from: this.inputName,
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

// 基础时间单位（一个点的持续时间，毫秒）
const DOT_DURATION = 100;
const DASH_DURATION = DOT_DURATION * 3;
const SIGNAL_GAP = DOT_DURATION;
const LETTER_GAP = DOT_DURATION * 3;
const WORD_GAP = DOT_DURATION * 7;

async function testInput() {
  // H (....)
  for (let i = 0; i < 4; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
    morseInput.release();
    if (i < 3) await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));
  }
  await new Promise((resolve) => setTimeout(resolve, LETTER_GAP));

  // E (.)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, LETTER_GAP));

  // L (.-..)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, DASH_DURATION));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
    morseInput.release();
    if (i < 1) await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));
  }
  await new Promise((resolve) => setTimeout(resolve, LETTER_GAP));

  // L (.-..)
  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));

  morseInput.press();
  await new Promise((resolve) => setTimeout(resolve, DASH_DURATION));
  morseInput.release();
  await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));

  for (let i = 0; i < 2; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
    morseInput.release();
    if (i < 1) await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));
  }
  await new Promise((resolve) => setTimeout(resolve, LETTER_GAP));

  // O (---)
  for (let i = 0; i < 3; i++) {
    morseInput.press();
    await new Promise((resolve) => setTimeout(resolve, DASH_DURATION));
    morseInput.release();
    if (i < 2) await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));
  }
  await new Promise((resolve) => setTimeout(resolve, WORD_GAP));

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
