#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';
import { fileURLToPath } from 'node:url';
import templatePackageJson from '../template/package.json' assert { type: 'json' };
const prompts = [
  {
    type: 'input',
    name: 'name',
    message: '项目名称',
  },
  // {
  //   type: 'list',
  //   name: 'lang',
  //   message: 'JS/TS',
  //   choices: ['JavaScript', 'TypeScript'],
  // },
];
async function bootstrap() {
  if (parseInt(process.version.slice(1)) < 16) {
    console.error('你的 Node.js 版本过低，请升级到 Node.js 12 或更高版本。');
    process.exit(1);
  } else {
    console.log('Node.js 版本符合要求！');
  }
  const { name } = await inquirer.prompt(prompts);
  console.log(`target name:`, name);
  const source = join(fileURLToPath(new URL('.', import.meta.url)), '../template');
  console.log(`source`, source);
  fs.cp(source, name, { recursive: true }, (err) => {
    if (err) {
      console.log(`err`, err);
    }
    // 替换package.json里面的名称
    templatePackageJson.name = name;
    fs.writeFileSync(join(name, 'package.json'), JSON.stringify(templatePackageJson, null, 2));
  });
}
bootstrap();
