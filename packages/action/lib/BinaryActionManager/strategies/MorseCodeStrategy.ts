import { Observable, timer, Subject } from 'rxjs';
import { filter, switchMap, map, takeUntil, buffer, debounceTime } from 'rxjs/operators';
import { IOStrategy } from './IOStrategy';
import { BinaryMessage } from '../BinaryActionManager';

export const MORSE_CODE_MAP = {
  '.-': 'A',
  '-...': 'B',
  '-.-.': 'C',
  '-..': 'D',
  '.': 'E',
  '..-.': 'F',
  '--.': 'G',
  '....': 'H',
  '..': 'I',
  '.---': 'J',
  '-.-': 'K',
  '.-..': 'L',
  '--': 'M',
  '-.': 'N',
  '---': 'O',
  '.--.': 'P',
  '--.-': 'Q',
  '.-.': 'R',
  '...': 'S',
  '-': 'T',
  '..-': 'U',
  '...-': 'V',
  '.--': 'W',
  '-..-': 'X',
  '-.--': 'Y',
  '--..': 'Z',
} as const;

export class MorseCodeStrategy implements IOStrategy {
  type = 'MORSE_CODE';
  private dotTime: number;
  private dashTime: number;
  private signalGap: number;
  private letterGap: number;
  private wordGap: number;

  constructor(
    dotTime: number = 100,
    dashTime: number = 300,
    signalGap: number = 100,
    letterGap: number = 300,
    wordGap: number = 700
  ) {
    this.dotTime = dotTime;
    this.dashTime = dashTime;
    this.signalGap = signalGap;
    this.letterGap = letterGap;
    this.wordGap = wordGap;
  }

  handle(messages: Observable<BinaryMessage>): Observable<string> {
    const codeSubject = new Subject<string>();
    let pressStartTime = 0;
    let lastReleaseTime = 0;
    let currentCode: string[] = [];
    let lastEmittedTime = 0;

    const emitLetter = (currentTime: number) => {
      if (currentCode.length > 0) {
        const letter = MORSE_CODE_MAP[currentCode.join('') as keyof typeof MORSE_CODE_MAP];
        if (letter) {
          codeSubject.next(letter);
          lastEmittedTime = currentTime;
          currentCode = [];
        }
      }
    };

    messages.subscribe((msg) => {
      const currentTime = msg.triggerTime;

      if (msg.value === 1) {
        pressStartTime = currentTime;
        
        // 检查信号间隔
        if (lastReleaseTime && (currentTime - lastReleaseTime) > this.signalGap) {
          // 如果超过字母间隔，输出当前字母
          if (currentTime - lastReleaseTime > this.letterGap) {
            emitLetter(currentTime);
          }
        }
        
        // 检查单词间隔
        if (lastReleaseTime && (currentTime - lastReleaseTime) > this.wordGap) {
          codeSubject.next(' ');
        }
      } else {
        const pressDuration = currentTime - pressStartTime;
        // 使用 dotTime 作为基准判断点划
        const signal = pressDuration > (this.dotTime * 2) ? '-' : '.';
        currentCode.push(signal);
        lastReleaseTime = currentTime;

        // 延迟检查是否需要输出字母
        setTimeout(() => {
          const now = Date.now();
          // 确保经过了足够的信号间隔
          if (now - lastReleaseTime > Math.max(this.signalGap, this.letterGap)) {
            emitLetter(now);
          }
        }, this.letterGap);
      }
    });

    return codeSubject.asObservable();
  }
}
