import Snowflake from './Snowflake'

/**
 * 
 * @param workerId 5位的workerId?
 * @param datacenterId 5位的datacenter
 * @returns 
 */
export function createTidGenerator(workerId: number = 0, datacenterId: number = 0) {
  return new Snowflake(workerId, datacenterId, 0)
} 

