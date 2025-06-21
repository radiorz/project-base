import { ID } from "./id"

/**
 * @function fun 
 * @description 函数用于
 * @param 
 * @returns
 * @example
 * fun() // ->
 */
export function isToMe(to: ID, orgs: ID[]) {
  return orgs.includes(to)
}
export function isBroadcast(to: ID, me: ID) {
  return me !== to
}
