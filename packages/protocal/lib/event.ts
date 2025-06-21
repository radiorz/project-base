export interface EventSchema  {
  /**
   * 编码
   */
  code: string | number;
 
  /**
   * 来源，自其他事件派生
   */
  derivedFrom: string;
  /**
   * 等级
   */
  level: number;
  /**
* qos 级别
* @description 
*/

  qos: number;
  /**
   * 
   */
  payload: Record<string, any> 
  // message
}

