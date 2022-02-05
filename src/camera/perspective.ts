import { PerspectiveCamera as PerspectiveCameraThree } from 'three';
import type { Camera } from 'three';
import { Renderer } from '../renderer';

export class PerspectiveCamera {
  static camera: Camera;

  static init() {
    const screenAspectRatio = Renderer.width / Renderer.height;
    this.camera = new PerspectiveCameraThree(30, screenAspectRatio, 1, 1000);
    this.camera.position.set(20, 15, 0);
    this.camera.lookAt(0, 0, 0);
  }
}
