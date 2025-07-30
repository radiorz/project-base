export function millisecondsToString(timeMillis: number): string {
  const hours = Math.floor(timeMillis / (60 * 60 * 1000));
  const minutes = Math.floor((timeMillis % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}:${minutes}`;
}
