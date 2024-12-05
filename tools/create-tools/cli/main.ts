import { Creator } from '../lib/Creator';
import { creatorCli } from './creator-cli';

creatorCli.start(async (options: any) => {
  const inst = new Creator(options);
  await inst.start();
});
