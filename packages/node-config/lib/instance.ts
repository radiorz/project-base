import { Config } from '@tikkhun/config-core';
import { EnvSource } from './EnvSource';
export const DEFAULT_ENV_MANAGER = Config.create({ sources: [new EnvSource()] });
