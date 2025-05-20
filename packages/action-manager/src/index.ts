/*
 * @FilePath: \project-base\packages\action\src\index.ts
 * @Author: zk.su
 * @Date: 2025-04-03 11:40:45
 * @LastEditTime: 2025-04-07 11:49:08
 * @LastEditors: zk.su
 * @Description: 
 * @TODO: 
 */
import { BinaryActionManager, LongPressInStrategy, LongPressStrategy, TurnOnStrategy } from '../lib/BinaryActionManager'
const binaryActionManager = new BinaryActionManager();

// 添加策略
binaryActionManager.addStrategy(new TurnOnStrategy());
binaryActionManager.addStrategy(new LongPressStrategy(3000));

// 移除策略
binaryActionManager.addStrategy(new LongPressInStrategy());

