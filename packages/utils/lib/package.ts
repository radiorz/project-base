import { PathResolver } from './path';

const pathResolver = new PathResolver();
export function hasDependency(packageJson: Record<string, any>, dep: string) {
  return !!(packageJson.devDependencies?.[dep] || packageJson.dependencies?.[dep]);
}
export async function getRootPackageJson() {
  return await import(pathResolver.root('package.json'));
}
