import { toDashCase } from '../string/toDashCase';

export function tranKeyToDashCase(style: Record<string, any>): string {
  return Object.entries(style)
    .map(([key, value]) => `${toDashCase(key)}: ${value};`)
    .join('');
}
