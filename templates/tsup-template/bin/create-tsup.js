#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';
import { fileURLToPath } from 'node:url';
const prompts = [
  {
    type: 'input',
    name: 'name',
    message: '项目名称',
  },
  {
    type: 'list',
    name: 'lang',
    message: 'JS/TS',
    choices: ['JavaScript', 'TypeScript'],
  },
];
async function bootstrap() {
  const { name, lang } = await inquirer.prompt(prompts);
  console.log(`commandRes`, name, lang);
  const source = join(fileURLToPath(new URL('.', import.meta.url)), '../template');
  console.log(`source`, source);
  fs.cp(source, name, { recursive: true }, (err) => {
    if (err) {
      console.log(`err`, err);
    }
  });
}
bootstrap();
