export function getOrderFromOrderQuery(order: string[]) {
  const orderBy: Record<string, 'ASC' | 'DESC'> = {};
  for (const item of order) {
    if (item.startsWith('-')) {
      orderBy[item.slice(1)] = 'DESC';
      continue;
    }
    orderBy[item] = 'ASC';
  }
  return orderBy;
}
