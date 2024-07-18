import { Config } from '../../config/lib/Config';
import { EnvSource } from './EnvSource';
export const DEFAULT_ENV_MANAGER = Config.create({ sources: [new EnvSource()] });
