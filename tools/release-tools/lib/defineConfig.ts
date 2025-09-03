import type { TikkhunReleaseDefaultOptions } from './tikkhun-release';

/**
 * 用于定义 Tikkhun Release 的配置参数，提供类型提示
 * @param options Tikkhun Release 的配置选项
 * @returns 配置选项，可直接用于 TikkhunRelease 函数
 * @example
 * ```typescript
 */
export function defineConfig(
  options: Partial<TikkhunReleaseDefaultOptions>
): Partial<TikkhunReleaseDefaultOptions> {
  // 直接返回配置对象，主要用于提供类型提示
  return options;
}

// 导出类型供用户使用
export type {
  TikkhunReleaseDefaultOptions
} from './tikkhun-release';
