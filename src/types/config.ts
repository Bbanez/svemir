import type { ShadowMapType } from 'three';

export interface SvemirConfigRenderer {
  shadowMapType?: ShadowMapType;
  size?: {
    width: number;
    height: number;
  };
}

export interface SvemirConfig {
  element: HTMLElement;
  onReady?(): Promise<void>;
  renderer?: SvemirConfigRenderer;
  frameTicker?: boolean;
}
