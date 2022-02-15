import { PerspectiveCamera as PerspectiveCameraThree } from 'three';
import { Renderer } from '../renderer';

export class PerspectiveCamera extends PerspectiveCameraThree {
  constructor(fov?: number, aspect?: number, near?: number, far?: number) {
    if (!aspect) {
      aspect = Renderer.width / Renderer.height;
    }
    super(fov || 30, aspect, near || 1, far || 1000);
  }
}
