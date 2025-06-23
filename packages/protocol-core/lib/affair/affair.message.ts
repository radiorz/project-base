import { Message } from '../message';
import { Affair, Tid } from './affair.type';

export interface AffairMessage<Payload = { [key: string]: any }> extends Message<Payload> {
  tid: Tid;
  affair: Affair['payload'];
}
