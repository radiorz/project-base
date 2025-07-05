export interface Getter {
  get(): Promise<string | number> | string | number;
}

