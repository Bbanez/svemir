import type { Svemir, SvemirConfig } from '../../../../types';

export type GameConfig = SvemirConfig;

export interface Game {
  s: Svemir;
  destroy(): Promise<void>;
}
