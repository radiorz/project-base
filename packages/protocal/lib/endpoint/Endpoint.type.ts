import { Description } from "../consts";
import { ID } from "../id";
import { EndpointType } from "./EndpointType.type";


export interface EndpointSchema extends Description {
  type: EndpointType['name'];
  configSchema: Record<string, any>;
}

export interface Endpoint extends Description {
  id: ID;
  type: EndpointSchema['name'];
  config: Record<string, any>
}


