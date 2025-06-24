
/**
 * @function genSipTid 
 * @description 函数用
 * 通话事务 ID 除了要放置在 mqtt 消息体内，还要放入 SDP 包中：

格式为：a=tid:<tid值>+L<呼叫等级>

说明：

● 加号 + 为字符串加号；
● 呼叫等级：0=普通呼叫；1=紧急呼叫；2=紧急增援；
● 普通呼叫时，+L0可以省略。
 * @param 
 * @returns
 * @example
 * genSipTid() // ->
 */
export function genSipTid(tid: string, level: number) {
  return `tid:${tid}+L${level}`
}
