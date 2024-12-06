#!/usr/bin/env node
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const templatesDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');

import { withTemplatesDir } from '@tikkhun/create';

withTemplatesDir(templatesDir);
