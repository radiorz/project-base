/**
 * @author
 * @file deduplicate.ts
 * @fileBase deduplicate
 * @path tools\deduplicate\lib\deduplicate.ts
 * @from
 * @desc
 * @example
 */

export interface DeduplicateOptions {
  sources: string[];
  include: string[];
  exclude: string[];
  target: string;
}

export function deduplicate(options?: Partial<DeduplicateOptions>) {
  const opts = Object.assign({}, deduplicate.defaultOptions, options);
  const md5Map = []
  const files = await glob(, '')
}
deduplicate.defaultOptions = Object.freeze({
  sources: [],
  include: ['**/*'],
  exclude: ['**/node_modules'],
  target: './dist',
}) as DeduplicateOptions;
