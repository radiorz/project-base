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
  private dotTime: number; // 点信号时长
  private dashTime: number; // 划信号时长
  private pauseTime: number; // 字符间暂停时长

  constructor(dotTime: number = 200, dashTime: number = 600, pauseTime: number = 1000) {
    this.dotTime = dotTime;
    this.dashTime = dashTime;
    this.pauseTime = pauseTime;
  }

  handle(messages: Observable<BinaryMessage>): Observable<string> {
    const codeSubject = new Subject<string>();

    messages
      .pipe(
        switchMap((msg) => {
          if (msg.value === 1) {
            return timer(this.dotTime, this.dashTime).pipe(
              takeUntil(messages.pipe(filter((m) => m.value === 0))),
              map((index) => (index === 0 ? '.' : '-')),
            );
          }
          return [];
        }),
        buffer(messages.pipe(debounceTime(this.pauseTime))),
      )
      .subscribe((codes) => {
        if (codes.length > 0) {
          console.log(`codes`, codes);
          const letter = MORSE_CODE_MAP[codes.join('') as string];
          if (letter) {
            codeSubject.next(letter);
          }
        }
      });

    return codeSubject.asObservable();
  }
}
