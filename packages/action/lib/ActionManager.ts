export interface Action {
  handle: (context: any) => any | Promise<any>;
}
export enum handleutionMode {
  Sequential, // 顺序执行
  Concurrent, // 并发执行（乱序执行）
}
export interface ActionhandleOptions {
  mode?: handleutionMode;
  context?: any;
}
export class ActionManager {
  createAction(name: string, handle: Action['handle']) {
    const action = {
      name,
      handle,
    };
    this.add(name, action);
    return action;
  }
  actions: Map<string, Action> = new Map();
  add(name: string, action: Action) {
    this.actions.set(name, action);
  }
  remove(name: string) {
    this.actions.delete(name);
  }
  get(name: string | string[]): Action | undefined | Array<Action | undefined> {
    if (typeof name === 'string') {
      return this.actions.get(name);
    }
    return name.map((name) => this.get(name)) as Array<Action | undefined>;
  }
  async handle(name: string, options?: ActionhandleOptions): Promise<any>;
  async handle(name: string[], options?: ActionhandleOptions): Promise<any[]>;
  async handle(name: string | string[], options?: ActionhandleOptions) {
    const actions = this.get(name);
    if (!actions) throw new Error(`Action ${name} not found`);
    if (Array.isArray(actions)) {
      if (options?.mode === handleutionMode.Concurrent) {
        return await Promise.all(actions.filter((action) => !!action).map((action) => action.handle(options?.context)));
      }
      // 顺序执行
      return await actions.reduce(async (prev, action) => {
        if (action) {
          await prev;
          return action.handle(options?.context);
        }
        return prev;
      }, Promise.resolve());
    }
    return await actions.handle(options?.context);
  }
}

export const actionManager = new ActionManager();
