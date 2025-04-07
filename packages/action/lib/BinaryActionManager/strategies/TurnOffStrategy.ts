import { Observable } from 'rxjs';
import { pairwise, filter, map } from 'rxjs/operators';
import { IOStrategy } from './IOStrategy';
import { BinaryMessage } from '../BinaryActionManager';

export class TurnOffStrategy implements IOStrategy {
  type = 'TURN_OFF';

  handle(messages: Observable<BinaryMessage>): Observable<string> {
    return messages.pipe(
      pairwise(),
      filter(([prev, curr]) => prev.value === 1 && curr.value === 0),
      map(() => this.type)
    );
  }
}
