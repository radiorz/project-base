export interface GetOptions {
  path: string;
}
export interface SetOptions {
  path: string;
  data: any;
}
export interface Api {
  get(path: string): any;
  get(getOptions?: Partial<GetOptions>): any;
  
  set(path: string, data: any): any;
  set(setOptions?: Partial<SetOptions>): any;
}
