import md5 from 'md5';
import { ID } from "../../core/id";
import { EventMessage } from "../eventMessage";
import { Event } from '../event';
export interface AlarmMessage<Payload = Record<string, any>> extends EventMessage<Payload> {
  payload: Alarm<Payload>
}

export interface Alarm<Payload = any> extends Event<Payload> {
  source: string;
}

interface GetSourceFromOptions {
  sourceId: ID,
  timestamp: number,

}
export function getSourceFrom(options: GetSourceFromOptions) {
  return md5(`${options.sourceId}${options.timestamp}`).toLocaleLowerCase()
}
