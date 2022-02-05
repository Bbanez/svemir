import { Color, Scene as SceneThree } from 'three';

export class Scene {
  static scene: SceneThree;

  static init() {
    this.scene = new SceneThree();
    this.scene.background = new Color(255, 0, 0);
  }
}
