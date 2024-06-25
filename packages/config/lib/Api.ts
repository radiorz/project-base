export interface GetOptions {
  path: string;
}
export interface RemoveOptions {
  path: string;
}
export interface SetOptions {
  path: string;
  data: any;
}
export interface Api {
  get(path: string): any;
  get(options?: Partial<GetOptions>): any;

  set(path: string, data: any): any;
  set(options?: Partial<SetOptions>): any;

  remove(path: string): any;
  remove(options?: Partial<RemoveOptions>): any;
}
