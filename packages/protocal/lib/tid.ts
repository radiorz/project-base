export const noTid = 0


export function getRandomTid() {
  return Math.random().toString(36).substring(2)
}
