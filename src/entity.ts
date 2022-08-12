import { Box3, BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { Scene } from './scene';
import type { EntityConfig } from './types';

export class Entity {
  obj: Mesh;
  protected bb: Box3;
  protected bbg: Mesh | undefined;

  constructor(config: EntityConfig) {
    this.obj = config.obj;
    this.bb = new Box3().setFromObject(this.obj);
  }

  showBB(): void {
    if (!this.bbg) {
      this.bbg = new Mesh(
        new BoxGeometry(
          Math.abs(this.bb.min.x) + Math.abs(this.bb.max.x),
          Math.abs(this.bb.min.y) + Math.abs(this.bb.max.y),
          Math.abs(this.bb.min.z) + Math.abs(this.bb.max.z),
        ),
        new MeshStandardMaterial({
          color: 0xff0000,
          opacity: 0.2,
          transparent: true,
        }),
      );
      Scene.scene.add(this.bbg);
    }
  }
}
