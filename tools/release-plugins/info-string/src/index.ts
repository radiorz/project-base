import { InfoString, strategyNames } from '../lib';
const infoString = new InfoString({
  info: {
    name: '@tikkhun/info-string',
    version: '1.0.0',
  },
  params: ['name', 'version', 'ttt'],
  paramDelimiter: '-',
  paramTransformers: {
    name: 'deleteScope',
    ttt: strategyNames['YYYY-MM-DD'],
  },
});
console.log(infoString.stringify());
