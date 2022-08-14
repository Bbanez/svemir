import {
  AmbientLight,
  AxesHelper,
  BoxBufferGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from 'three';
import { createSvemir } from '../../../main';
import { Scene } from '../../../scene';
import type { Camera, Game, GameConfig } from './types';
import { createPlayer, Player } from './player';
import { createCamera } from './camera';
import { MouseRay } from './mouse-ray';
import { Ticker } from '../../../ticker';
import { Assets, loadAssets } from './assets';
import { getPixelMatrixFromTexture } from './util';
import { PathFinder } from './path-finder';
import { Point2D } from '../../../math';
import { Obstacle } from './obstacle';

async function createUtils() {
  const axHelp = new AxesHelper(500);
  Scene.scene.add(axHelp);
}

async function createGlobalLights(config: { player: Player }): Promise<{
  destroy(): Promise<void>;
}> {
  const ambLight = new AmbientLight(0xffffff, 0.4);
  Scene.scene.add(ambLight);
  const dirLight = new DirectionalLight(0x9e73bc, 0.3);
  const dirLightOffset = {
    x: -400,
    y: 250,
    z: 10,
  };
  dirLight.position.set(
    dirLightOffset.x + config.player.obj.position.x,
    dirLightOffset.y + config.player.obj.position.y,
    dirLightOffset.z + config.player.obj.position.z,
  );
  dirLight.lookAt(
    config.player.obj.position.x,
    config.player.obj.position.y,
    config.player.obj.position.z,
  );
  dirLight.castShadow = true;
  const shadowSizeW = 400;
  const shadowSizeH = 400;
  const shadowRes = 4096;
  dirLight.shadow.mapSize.width = shadowRes;
  dirLight.shadow.mapSize.height = shadowRes;
  dirLight.shadow.camera.left = -shadowSizeW;
  dirLight.shadow.camera.right = shadowSizeW;
  dirLight.shadow.camera.top = shadowSizeH;
  dirLight.shadow.camera.bottom = -shadowSizeH;
  Scene.scene.add(dirLight);

  const tickUnsub = Ticker.subscribe(() => {
    dirLight.position.copy(
      new Vector3(
        dirLightOffset.x + config.player.obj.position.x,
        dirLightOffset.y + config.player.obj.position.y,
        dirLightOffset.z + config.player.obj.position.z,
      ),
    );
    dirLight.lookAt(
      config.player.obj.position.x,
      config.player.obj.position.y,
      config.player.obj.position.z,
    );
  });

  return {
    async destroy() {
      tickUnsub();
    },
  };
}

async function createEnv() {
  Assets.map.scene.uuid = 'map';
  Assets.map.scene.scale.setScalar(200);
  Assets.map.scene.position.set(200, 0, 200);
  Assets.map.scene.traverse((c) => {
    c.castShadow = true;
    c.receiveShadow = true;
  });
  Scene.scene.add(Assets.map.scene);
  const nogoMap = getPixelMatrixFromTexture(Assets.masksNogo, 0);
  const group = new Group();
  PathFinder.obstacles = [];
  for (let i = 0; i < nogoMap.length; i++) {
    for (let j = 0; j < nogoMap[i].length; j++) {
      const x = nogoMap[i][j];
      if (x > 100) {
        const o = new Obstacle(new Point2D(j, i), 1, 1, 1, 1);
        PathFinder.obstacles.push(o);
        const box = new Mesh(
          new BoxBufferGeometry(1, 25, 1),
          new MeshStandardMaterial({
            color: 0xff0000,
          }),
        );
        box.position.set(o.q.x + 0.5, 0, o.q.z + 0.5);
        group.add(box);
        const bb = new Mesh(
          new BoxBufferGeometry(o.qa + 2 * o.lx, 26, o.qb + 2 * o.lz),
          new MeshStandardMaterial({
            color: 0xffee00,
            opacity: 0.3,
            transparent: true,
          }),
        );
        bb.position.set(o.q.x + 0.5, 0, o.q.z + 0.5);
        group.add(bb);
        const b = new Mesh(
          new BoxBufferGeometry(0.1, 26, 0.1),
          new MeshStandardMaterial({
            color: 0xff00ff,
          }),
        );
        b.position.set(o.q.x, 0, o.q.z);
        group.add(b);
        for (let k = 0; k < 4; k++) {
          const c = o.corners[k];
          const cb = new Mesh(
            new BoxBufferGeometry(0.1, 26, 0.1),
            new MeshStandardMaterial({
              color: 0xff00ff,
            }),
          );
          cb.position.set(c.x, 0, c.z);
          group.add(cb);
        }
      }
    }
  }
  Scene.scene.add(group);
}

async function initMouseRay(config: { cam: Camera; player: Player }): Promise<{
  destroy(): Promise<void>;
}> {
  const mouseRay = new MouseRay(config.cam.cam, Assets.map.scene);
  mouseRay.subscribe((inter) => {
    if (inter[0]) {
      // config.player.setDesiredPosition(inter[0].point.x, inter[0].point.z);
      config.player.setPath(
        PathFinder.resolve(
          new Point2D(
            config.player.obj.position.x,
            config.player.obj.position.z,
          ),
          new Point2D(inter[0].point.x, inter[0].point.z),
        ),
      );
    }
  });

  return {
    async destroy() {
      await mouseRay.destroy();
    },
  };
}

export async function createGame(config: GameConfig): Promise<Game> {
  config.onReady = async () => {
    // Do nothing for now
  };
  const game = createSvemir(config);
  await loadAssets();
  await createEnv();
  const player = await createPlayer({
    playerId: '',
  });
  const cam = await createCamera({
    player,
  });
  await createUtils();
  const globalLights = await createGlobalLights({
    player,
  });
  const mouseRay = await initMouseRay({ cam, player });

  await game.run();

  return {
    s: game,
    async destroy() {
      await mouseRay.destroy();
      await globalLights.destroy();
      cam.destroy();
      await player.destroy();
      await game.destroy();
    },
  };
}
