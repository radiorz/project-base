import { Observable } from 'rxjs';
import { pairwise, filter, map } from 'rxjs/operators';
import { IOStrategy } from './IOStrategy';
import { BinaryMessage } from '../BinaryActionManager';

export class TurnOnStrategy implements IOStrategy {
  type = 'TURN_ON';

  handle(messages: Observable<BinaryMessage>): Observable<string> {
    return messages.pipe(
      pairwise(),
      filter(([prev, curr]) => prev.value === 0 && curr.value === 1),
      map(() => this.type)
    );
  }
}
