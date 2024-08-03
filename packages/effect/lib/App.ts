import { Effect, EffectManager } from './EffectManager';
export class App {
  effects: Effect[] = [];
  useEffect(effect: Effect) {
    this.effects.push(effect);
  }
  async handle(context: any) {
    return await EffectManager.do(context, this.effects);
  }
}
