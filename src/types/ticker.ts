export interface TickerCallback {
  (cTime: number, deltaTime: number): void;
}
export interface TickerUnsubscribe {
  (): void;
}