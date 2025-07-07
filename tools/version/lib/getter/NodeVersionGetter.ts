import { currentNodeVersion } from '@tikkhun/utils';
import { Getter } from './Getter';

export class NodeVersionGetter implements Getter {
  get() {
    return currentNodeVersion;
  }
}
