export interface Store {
  update(value: string | number): Promise<boolean> | boolean;
}
export interface StoreOptions {
  file: string;
}
