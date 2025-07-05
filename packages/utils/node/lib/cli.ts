import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);
// 检查是否被安装
export async function isInstalled(cwd: string) {
  try {
    const { stdout, stderr } = await execAsync(cwd + ' --help');
    if (!stdout) {
      throw new Error('command not found');
    }
    if (stderr) {
      throw new Error('command is error');
    }
    return true;
  } catch (error) {
    return false;
  }
}
