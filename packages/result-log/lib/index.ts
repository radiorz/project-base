import { OriginResult, ResultFactory, ResultFactoryImpl } from '@tikkhun/result';
import { LogAdapter } from '../../result/lib/ResultFactory';

const factory = new ResultFactoryImpl({ logAdapter: console });
export const log = (result: OriginResult) => {
  console.log(`result`, factory.createResult(result).final());
};
