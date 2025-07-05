import { createHash } from 'crypto';
import { createReadStream } from 'fs';
export async function calculateMD5(filePath: string) {
  // 创建一个md5 hash对象
  const hash = createHash('md5');
  const stream = createReadStream(filePath);
  // 更新数据
  stream.pipe(hash);
  // 监听'finish'事件，表示流已经处理完成

  return new Promise((resolve, reject) => {
    // 监听错误事件
    stream.on('error', (err) => {
      reject(`[错误] 计算md5,文件名: ${filePath},但出错,原因为: ${err.message}`);
    });
    stream.on('finish', () => {
      // 计算哈希值并输出结果
      const result = hash.digest('hex');
      resolve(result);
    });
  });
}
