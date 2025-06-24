import { Message } from '../message';
import { mergeOptions, replaceParams } from '@tikkhun/utils-core';
export interface Topic extends Pick<Message, 'type' | 'subType' | 'module' | 'name' | 'tid' | 'from' | 'to'> {
  /**
   * 公司
   */
  company: string; // 经常需要搞个公司标志
  /**
   * 主题域
   */
  domain: string;
  /**
   * 可以加一些其他的东西到结尾
   */
  attrs?: string; //比如action的子类型熄灯这个类型,配置变更就跟配置完整路径
}

export const defaultTopic: Omit<Topic, 'type' | 'name' | 'from'> = {
  tid: 0,
  company: '*',
  domain: '*',
  to: '*',
};
export function buildTopic(topic: Topic): string {
  return replaceParams(
    `/{company}/{domain}/{tid}/{from}/{to}/{type}/{subType}/{module}/{name}/{attrs}`,
    mergeOptions(defaultTopic, topic),
  );
}
