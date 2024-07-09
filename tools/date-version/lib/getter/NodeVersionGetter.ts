import { Getter } from './Getter';

export class NodeVersionGetter implements Getter {
  get() {
    // process.version=> v18.19.0
    return process.versions.node; // -> 18.19.0
  }
}
