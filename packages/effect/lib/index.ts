type Effect = (context: any) => (context: any) => void;
export function doEffect(context: any, effects: Effect[]) {
  // 先执行 外部函数 然后在回来的时候执行 return 函数
  let goBackEffects = [];
  for (const effect of effects) {
    goBackEffects.push(effect(context));
  }
  for (const effect of goBackEffects.reverse()) {
    effect(context);
  }
}
