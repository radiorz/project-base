import { StatusCategory } from '../status';

export const SleepingStatusCategory: StatusCategory = {
  default: 0,
  values: [
    {
      value: 0,
      name: '空闲',
      description: '空闲',
    },
    {
      value: 1,
      name: '休眠中',
      description: '休眠中',
    },
  ],
  name: '',
};
export const SleepingStatus = {
  /**
   * 空闲
   */
  idle: 0,
  /**
   * 通话中
   */
  nursing: 1, // 方向一个呼入一个呼出
};
