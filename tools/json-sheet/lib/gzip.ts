import zlib from 'zlib';
import util from 'util';

// 将异步方法转换为 Promise 版本
const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

// 原始 JSON 数据
const originalData = {
  timestamp: Date.now(),
  message: 'Hello, MQTT!',
  sensorValues: [25.3, 18.7, 30.1],
  isActive: true,
};

// ----------------------
// 1. 同步压缩/解压方案
// ----------------------
function syncCompressDemo() {
  try {
    // 压缩
    const jsonStr = JSON.stringify(originalData);
    const compressed = zlib.gzipSync(jsonStr, { level: zlib.constants.Z_BEST_COMPRESSION });
    console.log('[同步压缩] 压缩后字节数:', compressed.length);

    // 解压
    const decompressed = zlib.gunzipSync(compressed);
    const parsedData = JSON.parse(decompressed.toString());
    console.log('[同步解压] 数据验证:', parsedData.message === originalData.message);
  } catch (err) {
    console.error('同步操作出错:', err);
  }
}

// ----------------------
// 2. 异步压缩/解压方案 (推荐)
// ----------------------
async function asyncCompressDemo() {
  try {
    // 压缩
    const jsonStr = JSON.stringify(originalData);
    const compressed = await gzip(jsonStr, { level: 6 }); // 压缩级别 1-9
    console.log('[异步压缩] 压缩后字节数:', compressed.length);

    // 解压
    const decompressed = await gunzip(compressed);
    const parsedData = JSON.parse(decompressed.toString());
    console.log('[异步解压] 数据验证:', parsedData.sensorValues[0] === originalData.sensorValues[0]);
  } catch (err) {
    console.error('异步操作出错:', err);
  }
}

// 执行演示
syncCompressDemo();
asyncCompressDemo();
