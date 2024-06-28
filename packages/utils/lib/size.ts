let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
export function formatSizeUnits(size: number) {
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
