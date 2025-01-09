import { OriginResult, ResultFactory, ResultFactoryImpl } from '@tikkhun/result';

export const log = (result: OriginResult) => {
  console.log(`result`, ResultFactoryImpl.create());
};
