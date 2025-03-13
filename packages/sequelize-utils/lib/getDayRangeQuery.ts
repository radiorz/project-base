import { Op } from 'sequelize';
export function getDayRangeQuery(start: string | number, end: string | number) {
  if (!start || !end) {
    return;
  }
  let startDate = Date.parse('' + start);
  let endDate = Date.parse('' + end);
  // 增强鲁棒性,比较他们的大小
  if (startDate > endDate) {
    return {
      [Op.lt]: endDate,
      [Op.gt]: startDate,
    };
  }
  return {
    [Op.lt]: startDate,
    [Op.gt]: endDate,
  };
}
