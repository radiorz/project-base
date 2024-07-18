export interface ITimer {
  onTime(now: string | number): void;
  onStart(): void;
  onStop(): void;
}
