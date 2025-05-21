import { toDashCase } from '@tikkhun/utils';

export function keyToDashCase(style: Record<string, any>): string {
  return Object.entries(style)
    .map(([key, value]) => `${toDashCase(key)}: ${value};`)
    .join('');
}
