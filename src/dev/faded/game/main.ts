import { AmbientLight, AxesHelper, DirectionalLight, Vector3 } from 'three';
import type { CubeTexture } from 'three';
import { Loader } from '../../../loader';
import { createSvemir } from '../../../main';
import { Scene } from '../../../scene';
import type { Camera, Game, GameConfig } from './types';
import { createPlayer, Player } from './player';
import { createCamera } from './camera';
import { MouseRay } from './mouse-ray';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Ticker } from '../../../ticker';

async function createUtils() {
  const axHelp = new AxesHelper(500);
  Scene.scene.add(axHelp);
}

async function createGlobalLights(config: { player: Player }): Promise<{
  destroy(): Promise<void>;
}> {
  const ambLight = new AmbientLight(0xffffff, 0.3);
  Scene.scene.add(ambLight);
  const dirLight = new DirectionalLight(0xa584bc, 0.7);
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
    // dirLight.position.set(
    //   dirLightOffset.x + config.player.obj.position.x,
    //   dirLightOffset.y + config.player.obj.position.y,
    //   dirLightOffset.z + config.player.obj.position.z,
    // );
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

async function createEnv(config: { cam: Camera; player: Player }): Promise<{
  destroy(): Promise<void>;
}> {
  let mouseRay: MouseRay | undefined;
  Loader.onLoaded((item, data) => {
    if (item.name === 'skybox') {
      Scene.scene.background = data as CubeTexture;
    } else if (item.name === 'map') {
      const map = data as GLTF;
      map.scene.uuid = 'map';
      map.scene.scale.setScalar(200);
      map.scene.traverse((c) => {
        c.castShadow = true;
        c.receiveShadow = true;
      });
      Scene.scene.add(map.scene);
      mouseRay = new MouseRay(config.cam.cam, map.scene);
      mouseRay.subscribe((inter) => {
        if (inter[0]) {
          config.player.moveToPosition(inter[0].point);
        }
      });
    }
  });

  Loader.register([
    {
      path: [
        '/assets/faded/skybox/xn.png',
        '/assets/faded/skybox/xp.png',
        '/assets/faded/skybox/yp.png',
        '/assets/faded/skybox/yn.png',
        '/assets/faded/skybox/zp.png',
        '/assets/faded/skybox/zn.png',
      ],
      name: 'skybox',
      type: 'cubeTexture',
    },
    {
      path: '/assets/faded/maps/0/map.gltf',
      name: 'map',
      type: 'gltf',
    },
  ]);

  return {
    async destroy() {
      if (mouseRay) {
        await mouseRay.destroy();
      }
    },
  };
}

export async function createGame(config: GameConfig): Promise<Game> {
  config.onReady = async () => {
    await Loader.run();
  };
  const game = createSvemir(config);
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
  const gameEnv = await createEnv({ cam, player });

  await game.run();

  return {
    s: game,
    async destroy() {
      await gameEnv.destroy();
      await globalLights.destroy();
      cam.destroy();
      await player.destroy();
      await game.destroy();
    },
  };
}
