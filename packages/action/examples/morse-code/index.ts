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
  async pressDot() {
    await this.press();
    await new Promise((resolve) => setTimeout(resolve, DOT_DURATION));
    await this.release();
    await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));
  }

  async pressDash() {
    await this.press();
    await new Promise((resolve) => setTimeout(resolve, DASH_DURATION));
    await this.release();
    await new Promise((resolve) => setTimeout(resolve, SIGNAL_GAP));
  }

  async letterGap() {
    await new Promise((resolve) => setTimeout(resolve, LETTER_GAP));
  }

  async wordGap() {
    await new Promise((resolve) => setTimeout(resolve, WORD_GAP));
  }

  async inputLetter(pattern: string) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '.') {
        await this.pressDot();
      } else if (pattern[i] === '-') {
        await this.pressDash();
      }
    }
    await this.letterGap();
  }

  async inputWord(patterns: string[]) {
    for (let i = 0; i < patterns.length; i++) {
      await this.inputLetter(patterns[i]);
    }
    await this.wordGap();
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
  await morseInput.inputWord(['....', '.', '.-..', '.-..', '---']); // HELLO
  await morseInput.inputWord(['.--', '---', '.-.', '.-..', '-..']); // WORLD
}

testInput().then(() => {
  console.log('输入完成:', morseInput.getText());
});
