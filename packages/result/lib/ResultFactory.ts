import { ReuseResult, FinalResult, OriginResult, OriginToken, ResultFactory } from './ResultFactory.type';

interface ResultFactoryImplOptions {
  output(result: FinalResult): void;
  codeBuilder: (result: NormalizedResult) => string | number;
  messageBuilder: (result: NormalizedResult) => string;
}
export class ResultFactoryImpl implements ResultFactory {
  constructor(options: ResultFactoryImplOptions) {}
  createResult(result: OriginResult): ReuseResult {
    throw new Error('Method not implemented.');
  }
}
