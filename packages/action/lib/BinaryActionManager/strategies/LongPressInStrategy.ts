import { Observable, timer } from 'rxjs';
import { filter, switchMap, map, takeUntil } from 'rxjs/operators';
import { IOStrategy } from './IOStrategy';
import { BinaryMessage } from '../BinaryActionManager';

export class LongPressInStrategy implements IOStrategy {
  type = 'LONG_PRESS_IN';
  private longPressTime: number;

  constructor(longPressTime: number = 3000) {
    this.longPressTime = longPressTime;
  }

  handle(messages: Observable<BinaryMessage>): Observable<string> {
    return messages.pipe(
      filter(msg => msg.value === 1),
      switchMap(curr => 
        timer(this.longPressTime).pipe(
          takeUntil(
            messages.pipe(
              filter(msg => msg.value === 0)
            )
          ),
          map(() => this.type)
        )
      )
    );
  }
}
