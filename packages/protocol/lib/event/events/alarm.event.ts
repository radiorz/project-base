import { AffairPayload } from "../../core/affair";
import { ID } from "../../core/id";
import { EventMessage } from "../eventMessage";

export interface AlarmMessage<Payload = any> extends EventMessage<AffairPayload<Payload>> {
  tid: string | number;// 带事务 
}

export interface AlarmPayload {
  from: string ;
}

interface GetSourceFromOptions {
  sourceId: ID,
  timestamp: number,

}
import md5 from 
export function getSourceFrom(options: GetSourceFromOptions) {
  return md5()
}
