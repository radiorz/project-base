// 按 jsonschema
// 属性配置

import { createEventSchema } from '@/event';
import { Description } from 'dist';

export type ConfigPayloadSchema = Record<string, any>;

export type Config = Record<string, any>;

export interface ConfigSchema extends Description {
  module?: string; // 模块
  payloadSchema: ConfigPayloadSchema;
}
