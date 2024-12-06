#!/usr/bin/env node
import { Creator } from '../lib/Creator';
import { creatorCli } from './creator-cli';

creatorCli.start(async (options: any) => {
  const creator = new Creator(options);
  await creator.start();
});
