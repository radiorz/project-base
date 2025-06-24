// import md5 from 'md5';

import { createEventSchema, EventDefine } from '@/event';
export const ALARM_EVENT_TYPE = 'alarm';

export const createAlarmSchema = (schema: Omit<EventDefine, 'subType'>) => {
  return createEventSchema({
    ...schema,
    subType: ALARM_EVENT_TYPE,
  });
};
