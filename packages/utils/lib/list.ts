export function toBeList(sth: any) {
  return Array.isArray(sth) ? sth : [sth];
}
