export type Skin = (context: any) => (context: any) => void;

export class Onion {
  static async do(context: any, skins: Skin[]) {
    // 先执行 外部函数 然后在回来的时候执行 return 函数
    let goBackSkins = [];
    for (const skin of skins) {
      goBackSkins.push(await skin(context));
    }
    for (const effect of goBackSkins.reverse()) {
      await effect(context);
    }
    return context;
  }
}
