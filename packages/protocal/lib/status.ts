import { Description } from "./consts";

export interface StatusCategory extends Description {
  default: number; // 
  enumDict: Status[]
}

export interface Status extends Description {
  value: number;
}
