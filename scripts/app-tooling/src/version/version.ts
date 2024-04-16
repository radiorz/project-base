import { readJson, writeJson } from "fs-extra";
import dayjs from "dayjs";
export interface ChangeVersionOption {
  packageJsonPath: string;
  type: CHANGE_TYPE;
}
export enum CHANGE_TYPE {
  Date = "Date",
  AutoIncrement = "AutoIncrement", // 就是+1
}
const versionFactory = {
  [CHANGE_TYPE.Date]() {
    const version = dayjs().format("YYYY.MM.DD");
    return version;
  },
  [CHANGE_TYPE.AutoIncrement](currentVersion: string) {
    const pattern = /(\d+)\.(\d+)\.(\d+)/;
    const matches = currentVersion.match(pattern);
    if (!matches) {
      throw new Error("版本号格式不正确");
    }
    // 将小版本号转换为数字并加1
    let newMinorVersion = parseInt(matches[3]) + 1;

    // 构建新的版本号
    let newVersion = `${matches[1]}.${matches[2]}.${newMinorVersion}`;

    return newVersion;
  },
};
export async function changeVersion({
  packageJsonPath,
  type,
}: ChangeVersionOption) {
  // 先检查有没有
  const packageJson = await readJson(packageJsonPath);
  packageJson.version = versionFactory[type](packageJson.version);
  await writeJson(packageJsonPath, packageJson);
}
