import path from 'path';
const currentPath = path.resolve();
console.log(`currentPath`, currentPath);
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(`__dirname`, __dirname);
