import fs from 'fs';
import path from 'path';
import { workspace } from './utils';
export class Version {
  getNodeVersion() {
    // process.version=> v18.19.0
    return process.versions.node; // -> 18.19.0
  }
  setDotNodeVersion() {
    const nodeVersion = process.version;
    const filePath = path.join(workspace, '.node-version');
    fs.writeFileSync(filePath, nodeVersion, 'utf8');
  }
}
