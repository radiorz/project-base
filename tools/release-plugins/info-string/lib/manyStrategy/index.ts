import { defaultStrategy } from './default';
import { deleteScope } from './deleteScope';
import { strategyNames } from './strategyKeys';
import { timeFormatStrategies } from './timeFormat';

export const TRANSFORMERS = {
  ...timeFormatStrategies,
  [strategyNames.default]: defaultStrategy,
  [strategyNames.deleteScope]: deleteScope,
};
export * from './strategyKeys';
