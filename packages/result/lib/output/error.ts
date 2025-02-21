import { ReuseResult } from 'dist';

export function outputError(result: ReuseResult) {
  throw new Error(result.getString());
}
