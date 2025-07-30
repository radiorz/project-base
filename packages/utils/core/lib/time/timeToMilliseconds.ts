export function timeToMilliseconds(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours * 60 * 60 + minutes * 60) * 1000;
}
