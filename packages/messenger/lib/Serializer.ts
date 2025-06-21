// 序列号可能是一系列的事情 但最终结果就是 jsonlike -> buffer|string ,
// 最经典的就是 jsonstringify parse ,当然如果要压缩可能换成 msgpack5 等 hex一下 然后message 的话会 minify或者treeshake一下,反过来就是 normalize 咯
// 反序列化 就是 buffer|string -> jsonlike
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
