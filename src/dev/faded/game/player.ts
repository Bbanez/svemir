import { BoxBufferGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { Entity } from '../../../entity';
import { Scene } from '../../../scene';
import type { PlayerConfig, PlayerCreateConfig } from './types';

export class Player extends Entity {
  constructor(config: PlayerConfig) {
    super(config);
    const height = this.bb.max.y - this.bb.min.y;
    config.obj.position.y = height / 2;
  }

  moveToPosition(point: Vector3): void {
    const heightOffset = (this.bb.max.y - this.bb.min.y) / 2;
    this.obj.position.set(point.x, point.y + heightOffset, point.z);
  }

  async destroy() {
    // TODO: Remove junk.
  }
}

export async function createPlayer(
  _config: PlayerCreateConfig,
): Promise<Player> {
  const player = new Mesh(
    new BoxBufferGeometry(1, 3, 1),
    new MeshStandardMaterial({
      color: 0xaa9900,
    }),
  );
  player.castShadow = true;
  player.receiveShadow = true;
  Scene.scene.add(player);

  return new Player({
    obj: player,
  });
}
