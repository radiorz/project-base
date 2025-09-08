import dayjs from 'dayjs';
import { strategyNames } from './strategyKeys';
export function timeFormat(value: any, formatPattern = 'YYYY-MM-DD-HH-mm-ss') {
  return dayjs(value).format(formatPattern);
}

export const timeFormatStrategies = {
  [strategyNames['YYYY-MM-DD-HH-mm-ss']]: (value: any) => timeFormat(value),
  [strategyNames['YYYY-MM-DD']]: (value: any) => timeFormat(value, 'YYYY-MM-DD'),
  [strategyNames['HH-mm-ss']]: (value: any) => timeFormat(value, 'HH-mm-ss'),
};
