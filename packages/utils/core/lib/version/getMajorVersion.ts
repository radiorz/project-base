export function getMajorVersion(version: string) {
  return version.match(/^(\d)\./);
}
