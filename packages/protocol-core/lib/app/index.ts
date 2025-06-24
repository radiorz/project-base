import { Action, ActionSchema } from '@/action';
import { Description } from '@/core';
import { EventSchema } from '@/event';
export interface ModuleSchema extends Description {
  // config status 可以合在一起，但要注意不要修改到状态
  configSchema?: Record<string, any>;
  statusSchema?: Record<string, any>;
  actionSchemas: ActionSchema[];
  eventSchemas: EventSchema[];
}

export interface AppSchema extends Description {
  moduleSchemas: Record<string, ModuleSchema>; // 这里是注册模块 比如我可以注册sip模块，注册mqtt模块等
}
// 模块
export interface Module extends Description {
  status: Record<string, any>;
  config: Record<string, any>; // 根据模块升成
  request: (action: Action) => any;
  exec: (action: Action) => any;
  onEvent: (action: Action) => any;
}

export interface App extends Description {
  modules: Record<string, Module>;
}
