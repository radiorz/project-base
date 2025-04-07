/*
 * @FilePath: \project-base\packages\action\lib\BinaryActionManager\strategies\IOStrategy.ts
 * @Author: zk.su
 * @Date: 2025-04-07 11:36:01
 * @LastEditTime: 2025-04-07 11:40:29
 * @LastEditors: zk.su
 * @Description: 
 * @TODO: 
 */
import { Observable } from 'rxjs';
import { BinaryMessage } from '../BinaryActionManager';

export interface IOStrategy {
  type: string;
  handle(messages: Observable<BinaryMessage>): Observable<string>;
}
