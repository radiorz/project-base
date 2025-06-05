import { PassThrough } from 'stream';
/**
 * @function bufferToStream
 * @description 函数用于
 * @param
 * @returns
 * @example
 * bufferToStream() // ->
 */
export function bufferToStream(buffer: Buffer) {
  const bufferStream = new PassThrough(); // 声明一个PassThrough流，将输入字节传到输出
  bufferStream.end(buffer); // 初始化的流，一定为空，这时候让它读取文件的流
  return bufferStream; // 返回流
}
