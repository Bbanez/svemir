import type { Camera } from 'three';

export interface DefaultCamera extends Camera{
  updateAspect(aspect: number): void;
}
