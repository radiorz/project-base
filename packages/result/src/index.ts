import { ResultFactory } from '../lib';
import zh from './zh';

const resultFactory = new ResultFactory({
  friendlyMessageBuilder: (result) => {
    return zh[result.bizChain.join('.')] ?? zh['default'];
  },
});
