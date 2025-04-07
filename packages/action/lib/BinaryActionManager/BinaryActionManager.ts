/*
 * @FilePath: \project-base\packages\action\lib\BinaryActionManager\BinaryActionManager.ts
 * @Author: zk.su
 * @Date: 2025-04-03 13:57:47
 * @LastEditTime: 2025-04-07 11:41:22
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/*
 * @FilePath: \project-base\packages\action\lib\BinaryActionManager\BinaryActionManager.ts
 * @Author: zk.su
 * @Date: 2025-04-03 13:57:47
 * @LastEditTime: 2025-04-07 11:37:55
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { ActionManager, actionManager, Action } from '../ActionManager';
import { Subject, Observable, timer, merge } from 'rxjs';
import { pairwise, startWith, filter, switchMap, map, takeUntil, groupBy } from 'rxjs/operators';
import { IOStrategy } from './strategies/IOStrategy';

export enum BinaryActionType {
  TURN_ON = 'TURN_ON', // 从0变1
  TURN_OFF = 'TURN_OFF', // 从1变0
  LONG_PRESS = 'LONG_PRESS', // 持续1超过3秒后变0
}

export interface BinaryMessage {
  from: string;
  value: number;
  triggerTime: number;
}

export interface BinaryActionManagerOptions {
  actionManager: ActionManager;
  longPressTime: number; // 长按时间，默认3000ms
}

export class BinaryActionManager {
  static defaultOptions: BinaryActionManagerOptions = Object.freeze({
    actionManager,
    longPressTime: 3000,
  });

  private options: BinaryActionManagerOptions;
  private ioActionBinder: Map<string, string[]>;
  private messageSubject: Subject<BinaryMessage>;
  private gpioStreams: Map<string, Observable<BinaryActionType>>;
  strategies: Map<string, IOStrategy> = new Map();

  constructor(options?: Partial<BinaryActionManagerOptions>) {
    this.options = Object.assign({}, BinaryActionManager.defaultOptions, options);
    this.ioActionBinder = new Map();
    this.messageSubject = new Subject<BinaryMessage>();
    this.gpioStreams = new Map();
    this.initializeBinaryStreams();
  }

  addStrategy(strategy: IOStrategy) {
    this.strategies.set(strategy.type, strategy);
    this.initializeBinaryStreams(); // 重新初始化流以包含新策略
  }

  removeStrategy(strategyType: string) {
    this.strategies.delete(strategyType);
    this.initializeBinaryStreams(); // 重新初始化流以移除策略
  }

  private initializeBinaryStreams() {
    this.gpioStreams.forEach((stream) => stream.subscribe().unsubscribe());
    this.gpioStreams.clear();

    this.messageSubject.pipe(groupBy((msg) => msg.from)).subscribe((group) => {
      const strategyStreams = Array.from(this.strategies.values()).map((strategy) =>
        strategy.handle(group).pipe(map((type) => ({ type, gpioId: group.key }))),
      );

      merge(...strategyStreams).subscribe(({ type, gpioId }) => {
        const actions = this.ioActionBinder.get(`${gpioId}:${type}`);
        if (actions) {
          actions.forEach((actionName) => {
            this.options.actionManager.handle(actionName);
          });
        }
      });
    });
  }

  onMessage(message: BinaryMessage) {
    this.messageSubject.next(message);
  }

  bind(actionName: string, gpioId: string, actionType: BinaryActionType) {
    const key = `${gpioId}:${actionType}`;
    const existingActions = this.ioActionBinder.get(key) || [];
    this.ioActionBinder.set(key, [...existingActions, actionName]);
  }

  unbind(actionName: string, gpioId: string, actionType: BinaryActionType) {
    const key = `${gpioId}:${actionType}`;
    const existingActions = this.ioActionBinder.get(key) || [];
    this.ioActionBinder.set(
      key,
      existingActions.filter((name) => name !== actionName),
    );
  }
}
