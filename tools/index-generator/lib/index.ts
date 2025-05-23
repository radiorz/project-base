// 引入必要的模块
import { glob } from 'glob';
import fs from 'fs/promises';
interface GenerateIndexOptions {
  indexName: string;
}
export async function generateIndex(path: string, options?: Partial<GenerateIndexOptions>) {
  try {
    // 使用 glob 获取指定目录下的所有文件路径
    const files = await glob(path);

    // 将文件路径转换为 export * from "路径" 格式的语句
    const exportStatements = files.map((file) => `export * from "${file}";`).join('\n');

    // 将这些语句写入 index.ts 文件
    await fs.writeFile(options?.indexName || 'index.ts', exportStatements, 'utf-8');
  } catch (error) {
    console.error('生成 index 文件时出错:', error);
  }
}
