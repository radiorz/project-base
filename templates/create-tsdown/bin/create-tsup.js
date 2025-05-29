#!/usr/bin/env node
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { withTemplatesDir } from '@tikkhun/create';

const templatesDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');
withTemplatesDir(templatesDir);
