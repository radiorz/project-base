import { OriginResult, ResultFactory, ResultFactoryImpl } from '@tikkhun/result';

const factory = new ResultFactoryImpl();
export const log = (result: OriginResult) => {
  console.log(`result`, factory.createResult(result).final());
};
