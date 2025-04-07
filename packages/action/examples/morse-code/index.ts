import { BinaryActionManager } from '../../lib/BinaryActionManager';
import { MorseCodeStrategy } from './MorseCodeStrategy';

// 摩斯密码映射表
const MORSE_CODE_MAP = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
  '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
  '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
  '--..': 'Z'
};

class MorseCodeInput {
  private binaryManager: BinaryActionManager;
  private currentText: string = '';

  constructor() {
    this.binaryManager = new BinaryActionManager();
    this.initializeMorseCode();
  }

  private initializeMorseCode() {
    // 添加摩斯密码策略
    this.binaryManager.addStrategy(new MorseCodeStrategy());

    // 绑定摩斯密码处理
    this.binaryManager.bind('morseInput', 'input1', 'MORSE_CODE');

    // 处理摩斯密码输入
    this.binaryManager.options.actionManager.on('morseInput', (morseCode: string) => {
      const letter = MORSE_CODE_MAP[morseCode];
      if (letter) {
        this.currentText += letter;
        console.log(`当前输入: ${this.currentText}`);
        console.log(`识别到字母: ${letter} (摩斯密码: ${morseCode})`);
      } else {
        console.log(`未识别的摩斯密码: ${morseCode}`);
      }
    });
  }

  // 模拟按键按下
  press() {
    this.binaryManager.onMessage({
      from: 'input1',
      value: 1,
      triggerTime: Date.now()
    });
  }

  // 模拟按键释放
  release() {
    this.binaryManager.onMessage({
      from: 'input1',
      value: 0,
      triggerTime: Date.now()
    });
  }

  // 获取当前输入的文本
  getText() {
    return this.currentText;
  }

  // 清空当前输入
  clear() {
    this.currentText = '';
  }
}

// 使用示例
const morseInput = new MorseCodeInput();

// 模拟输入字母 "A" (.- 摩斯密码)
async function inputA() {
  // 点 (.)
  morseInput.press();
  await new Promise(resolve => setTimeout(resolve, 100));
  morseInput.release();
  await new Promise(resolve => setTimeout(resolve, 200));

  // 划 (-)
  morseInput.press();
  await new Promise(resolve => setTimeout(resolve, 500));
  morseInput.release();
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// 测试输入
inputA().then(() => {
  console.log('最终输入结果:', morseInput.getText());
});
