// 引入必要的模块
import { mergeOptions } from '@tikkhun/utils-core';
import { statSync } from 'fs';
import { access, constants, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
export const DefaultGenerateIndexOptions = {
  cwd: '.',
  indexName: 'index.ts',
  include: ['*'],
  exclude: [],
  clean: false,
  child: false,
  debug: false
};

type GenerateIndexOptions = typeof DefaultGenerateIndexOptions & {
  include: string | string[];
  exclude: string[];
};
export async function generateIndex(options?: Partial<GenerateIndexOptions>) {
  try {
    const opts = mergeOptions(DefaultGenerateIndexOptions, options) as GenerateIndexOptions;
    if (opts.debug) console.log(`opts`, opts)
    const cwd = path.resolve(opts.cwd);
    // console.log(`path `, path.resolve(cwd));
    // 使用 glob 获取指定目录下的所有文件路径
    if (opts.child) {
      // 找到include下所有的目录
      const files = await glob('**/*', { cwd, ignore: opts.exclude });
      const dirs = files.filter((file) => {
        const fileStat = statSync(path.join(cwd, file));
        return fileStat.isDirectory();
      });
      // 遍历目录
      for (const dir of dirs) {
        console.log('对目录进行index生成', dir)
        // 递归调用 generateIndex
        await generateIndex({ ...opts, cwd: path.join(cwd, dir), child: false });
      }
      return
    }
    const files = await glob(opts.include, { cwd, ignore: opts.exclude });
    // 将文件路径转换为 export * from "路径" 格式的语句
    const exportStatements = files
      .map(
        (file) => `export * from "./${path.extname(file) ? path.basename(file).split(path.extname(file))[0] : file}";`,
      )
      .join('\n');
    console.log(exportStatements);
    // 将这些语句写入 index.ts 文件
    // 检查文件是否存在，如果不存在则创建,存在不创建
    const toWriteFile = path.join(cwd, opts.indexName);
    if (!opts?.clean && (await isFileExists(toWriteFile))) {
      console.error(`index文件已存在，不进行创建,文件名为${toWriteFile}`);
      return;
    }
    await writeFile(toWriteFile, exportStatements, 'utf-8');
  } catch (error) {
    console.error('生成 index 文件时出错:', error);
  }
}

export async function isFileExists(filePath: string) {
  // 检查文件是否存在
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (accessError) {
    // 文件不存在，继续创建
    return false;
  }
}
