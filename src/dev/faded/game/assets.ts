import type { CubeTexture, Texture } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Loader } from '../../../loader';

interface Assets {
  map: GLTF;
  skybox: CubeTexture;
  masksNogo: Texture;
}

export const Assets: Assets = {} as never;

export async function loadAssets(): Promise<void> {
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
    {
      path: '/assets/faded/maps/0/masks/nogo.png',
      name: 'masksNogo',
      type: 'texture',
    },
  ]);

  Loader.onLoaded((item, data) => {
    const key = item.name as keyof Assets;
    Assets[key] = data as never;
    // if (item.name === 'skybox') {
    //   Assets.skybox = data as CubeTexture;
    // } else if (item.name === 'map') {
    //   const map = data as GLTF;
    //   Assets.map = map;
    //   // map.scene.uuid = 'map';
    //   // map.scene.scale.setScalar(200);
    //   // map.scene.traverse((c) => {
    //   //   c.castShadow = true;
    //   //   c.receiveShadow = true;
    //   // });
    //   // Scene.scene.add(map.scene);
    //   // mouseRay = new MouseRay(config.cam.cam, map.scene);
    //   // mouseRay.subscribe((inter) => {
    //   //   if (inter[0]) {
    //   //     config.player.moveToPosition(inter[0].point);
    //   //   }
    //   // });
    // }
  });
  await Loader.run();
}
