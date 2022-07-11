export interface Svemir {
  run(): Promise<void>;
  destroy(): Promise<void>;
}
