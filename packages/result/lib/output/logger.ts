import { ReuseResult } from 'dist';

export function outputConsole(result: ReuseResult) {
  console.log(`[${result.getCode()}]`, result.getString());
}
