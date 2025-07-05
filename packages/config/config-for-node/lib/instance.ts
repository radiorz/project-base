import { Config } from '@tikkhun/config-core';
import { ProcessEnvSource } from './ProcessEnvSource';
export const DEFAULT_ENV_MANAGER = Config.create({ sources: [new ProcessEnvSource()] });
