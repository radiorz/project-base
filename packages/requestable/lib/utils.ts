let a = 1;
export function getRandom() {
  return '' + Date.now() + a++;
}
