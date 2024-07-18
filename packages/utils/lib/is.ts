import { nativeNumber } from "./regex";

export function isInt(n: any) {
  return Number.isInteger(n);
}
export function isPositiveInt(n: any) {
  return isInt(n) && n > 0;
}
export function isBiggerThanMinusOne(n: any) {
  return n > -1;
}
export function isNativeNumber(n: any) {
  return nativeNumber.test(n);
}
