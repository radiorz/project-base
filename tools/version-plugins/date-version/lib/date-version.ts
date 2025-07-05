import { mergeOptions } from '@tikkhun/utils-core';
import dayjs from 'dayjs';

export const DEFAULT_DATE_VERSION_GETTER_OPTIONS = {
    pattern: 'YYYY.M.D',
};
/**
 * @function getDateVersion 
 * @description 函数用于
 * @param 
 * @returns
 * @example
 * getDateVersion() // -> 2025.7.5
 */
export function getDateVersion(options?: Partial<typeof DEFAULT_DATE_VERSION_GETTER_OPTIONS>) {
    const opts = mergeOptions(DEFAULT_DATE_VERSION_GETTER_OPTIONS, options);
    const version = dayjs().format(opts.pattern)
    return version
}
export function trimVersionStartZero(version: string) {
    const [majar, minor, patch] = version.split('.')
    const trimVersion = `${majar.replace(/^0+/, '')}.${minor.replace(/^0+/, '')}.${patch.replace(/^0+/, '')}`
    return trimVersion
}