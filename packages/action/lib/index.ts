// 定义自定义 ActionMgr 类型，继承 Map 并添加 do 方法
interface ActionMgr extends Map<string, Function> {
  do: (name: string, ...args: any[]) => any | Promise<any>;
}

export const DefaultActionMgrOptions = {};
export type ActionMgrOptions = typeof DefaultActionMgrOptions;
export const createActionMgr = (options: Partial<ActionMgrOptions> = {}) => {
  // const opts = Object.assign({}, DefaultActionMgrOptions, options);
  // 显式指定 actionMgr 类型为 ActionMgr
  const actionMgr = new Map<string, Function>() as ActionMgr;
   // TODO name 能不能用map中的key来提示。
  actionMgr.do = (name: string, ...args: any[]) => {
    const action = actionMgr.get(name);
    if (!action) throw new Error(`Action ${name} not found`);
    return action(...args);
  };
  return actionMgr;
};
