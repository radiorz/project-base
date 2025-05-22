import { isInt } from './isInt';
export function isPositiveInt(n: any) {
  return isInt(n) && n > 0;
}
