import {
  BoxBufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector3,
} from 'three';
import { Entity } from '../../../entity';
import { Point2D } from '../../../math';
import { Scene } from '../../../scene';
import { Ticker } from '../../../ticker';
import type { Linear2DFn } from '../../../types';
import { FunctionBuilder } from '../../../util';
import { Assets } from './assets';
import type { PlayerConfig, PlayerCreateConfig } from './types';

export class Player extends Entity {
  private tickUnsubs: Array<() => void> = [];
  private ray = new Raycaster();
  private lastKnowPosition = new Point2D(-1, -1);
  private desiredPosition = new Point2D(0, 0);
  private yRayDir = new Vector3(0, -1, 0);
  private speedFn: Linear2DFn;
  private path: Point2D[] = [];

  speed = 1;

  private calcYPosition() {
    let isMoved = false;
    if (this.obj.position.x !== this.lastKnowPosition.x) {
      this.lastKnowPosition.x = this.obj.position.x;
      isMoved = true;
    }
    if (this.obj.position.z !== this.lastKnowPosition.z) {
      this.lastKnowPosition.z = this.obj.position.z;
      isMoved = true;
    }
    if (isMoved) {
      this.ray.set(
        new Vector3(this.lastKnowPosition.x, 100, this.lastKnowPosition.z),
        this.yRayDir,
      );
      const intersect = this.ray.intersectObject(Assets.map.scene, true);
      if (intersect[0]) {
        const heightOffset = (this.bb.max.y - this.bb.min.y) / 2;
        this.obj.position.y = intersect[0].point.y + heightOffset;
      }
    }
  }

  private calcNewPosition() {
    if (this.path.length > 0) {
      if (
        this.desiredPosition.x === this.obj.position.x &&
        this.desiredPosition.z === this.obj.position.z
      ) {
        const nextPosition = this.path.splice(0, 1)[0];
        if (nextPosition) {
          this.desiredPosition.setX(nextPosition.x);
          this.desiredPosition.setZ(nextPosition.z);
        }
      }
    }
    let updateX = true;
    let updateZ = true;
    const rx = this.desiredPosition.x - this.obj.position.x;
    const rz = this.desiredPosition.z - this.obj.position.z;
    const d = Math.sqrt(rx * rx + rz * rz);
    const m = parseInt((d / this.speedFn(this.speed)).toFixed(0));
    const deltaD = d / m;
    const theta = Math.acos(rx / d);
    if (!isNaN(theta)) {
      this.obj.rotation.y = rz < 0 ? theta : -theta;
    }
    const deltaX = deltaD * Math.cos(theta);
    if (Math.abs(rx) < Math.abs(deltaX)) {
      updateX = false;
      this.obj.position.x = this.desiredPosition.x;
    }
    let deltaZ = Math.sqrt(deltaD * deltaD - deltaX * deltaX);
    deltaZ = rz > 0 ? deltaZ : -deltaZ;
    if (Math.abs(rz) < Math.abs(deltaZ)) {
      updateZ = false;
      this.obj.position.z = this.desiredPosition.z;
    }
    if (!isNaN(deltaX) && updateX) {
      this.obj.position.x = this.obj.position.x + deltaX;
    }
    if (!isNaN(deltaZ) && updateZ) {
      this.obj.position.z = this.obj.position.z + deltaZ;
    }
  }

  constructor(config: PlayerConfig) {
    super(config);
    this.speedFn = FunctionBuilder.linear2D([
      [0, 0],
      [1, 0.1],
    ]);
    const height = this.bb.max.y - this.bb.min.y;
    this.obj.position.y = height / 2;
    this.desiredPosition.set(this.obj.position.x, this.obj.position.z);
    let ticks = 0;
    this.tickUnsubs.push(
      Ticker.subscribe(() => {
        // TODO: Try to improve ticker.
        if (ticks < 2) {
          ticks++;
          return;
        }
        this.calcYPosition();
        this.calcNewPosition();
      }),
    );
  }

  moveToPosition(point: Vector3): void {
    const heightOffset = (this.bb.max.y - this.bb.min.y) / 2;
    this.obj.position.set(point.x, point.y + heightOffset, point.z);
  }

  moveToPositionXZ(x: number, z: number): void {
    this.obj.position.x = x;
    this.obj.position.z = z;
  }

  setDesiredPosition(x: number, z: number): void {
    this.desiredPosition.x = x;
    this.desiredPosition.z = z;
  }

  setPath(path: Point2D[]): void {
    this.path = path;
    this.desiredPosition.set(this.obj.position.x, this.obj.position.z);
  }

  async destroy() {
    this.tickUnsubs.forEach((f) => f());
  }
}

export async function createPlayer(
  _config: PlayerCreateConfig,
): Promise<Player> {
  const player = new Mesh(
    new BoxBufferGeometry(1, 3, 2),
    new MeshStandardMaterial({
      color: 0xaa9900,
    }),
  );
  player.position.set(110, 0, 285);
  player.castShadow = true;
  player.receiveShadow = true;
  Scene.scene.add(player);

  return new Player({
    obj: player,
  });
}
