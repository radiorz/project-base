import { Action } from '@/action';
import { Description } from '@/core';
export interface ModuleSchema extends Description {
  // config status 可以合在一起，但要注意不要修改到状态
  configSchema?: Record<string, any>;
  statusSchema?: Record<string, any>;
  actions: any;
  events: any;
}

export interface AppSchema extends Description {
  moduleSchemas: Record<string, ModuleSchema>; // 这里是注册模块 比如我可以注册sip模块，注册mqtt模块等
}
// 应用
export interface App extends Description {
  status: Record<string, any>;
  config: Record<string, any>; // 根据模块升成
  request: (action: Action) => any;
  exec: (action: Action) => any;
  onEvent: (action: Action) => any;
}
