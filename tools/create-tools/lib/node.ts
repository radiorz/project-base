import packageJson from '../package.json';
export function checkNodeVersion(version = 16) {
  if (parseInt(process.version.slice(1)) < version) {
    console.error(`你的 Node.js 版本过低，请升级到 Node.js ${version} 或更高版本。`);
    process.exit(1);
  } else {
    console.log('Node.js 版本符合要求！');
  }
}
export function echoPackageVersion() {
  console.log('版本', packageJson.version);
}
