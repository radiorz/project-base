export interface Serialize {
  (data: any): string | Buffer;
}
export interface Deserialize {
  (data: string | Buffer): any;
}
export function jsonSerialize(data: JSON) {
  return JSON.stringify(data);
}

export function jsonDeserialize(data: string, options?: { allowError: boolean }) {
  try {
    return JSON.parse(data);
  } catch (error) {
    if (!options?.allowError) {
      throw error;
    }
    return data;
  }
}
