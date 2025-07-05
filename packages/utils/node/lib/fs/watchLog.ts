import { type PathLike, watch } from 'fs';
export function watchLog(filename: PathLike) {
  watch(filename, (eventType, filename) => {
    if (filename) {
      console.log(`${eventType} on file: ${filename}`);
    } else {
      console.log('filename not provided');
    }
  });
}
