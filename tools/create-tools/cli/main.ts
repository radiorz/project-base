#!/usr/bin/env node
import { Creator } from '../lib/Creator';
import { creatorCli } from '../lib/cli/creator-cli';
creatorCli.welcome();
creatorCli.start(async (options: any) => {
  const creator = new Creator(options);
  await creator.start();
});
