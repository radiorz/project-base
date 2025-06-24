import { StatusCategory } from '../status';

export const CallingStatusCategory: StatusCategory = {
  default: 0,
  values: [
    {
      value: 0,
      name: '空闲',
      description: '空闲',
    },
    {
      value: 1,
      name: '通话中',
      description: '通话中',
    },
  ],
  name: '',
};
export const CallingStatus = {
  /**
   * 空闲
   */
  idle: 0,
  /**
   * 通话中
   */
  calling: 1, // 方向一个呼入一个呼出
};
