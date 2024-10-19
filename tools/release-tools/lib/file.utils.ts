import crypto from 'crypto';
import fs from 'fs';
export async function calculateMD5(filePath: string) {
  // 创建一个md5 hash对象
  const hash = crypto.createHash('md5');
  const stream = fs.createReadStream(filePath);
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
export async function getFileSize(filePath: string) {
  try {
    // 使用fs.promises.stat获取文件状态
    const stats = await fs.promises.stat(filePath);
    // 输出文件大小
    return stats.size;
  } catch (err) {
    // 错误处理
    console.error(`Error getting file size: ${err}`);
    throw err; // 抛出错误，以便调用者可以进一步处理
  }
}

export function calculateMD5Sync(filePath: string) {
  // 创建一个md5 hash对象
  const hash = crypto.createHash('md5');
  // 同步读取文件内容并更新哈希
  const fileBuffer = fs.readFileSync(filePath);
  hash.update(fileBuffer);
  // 计算 MD5 值
  const md5 = hash.digest('hex');
  return md5;
}
export function getFileSizeSync(filePath: string) {
  // 使用fs.promises.stat获取文件状态
  const stats = fs.statSync(filePath);
  // 输出文件大小
  return stats.size;
}
