import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three';
import { Spectator } from './util';
import { PerspectiveCamera } from './camera';
import { Keyboard } from './keyboard';
import { Loader } from './loader';
import { Mouse } from './mouse';
import { Renderer } from './renderer';
import { Scene } from './scene';
import { Ticker } from './ticker';
import type { Svemir, SvemirConfig } from './types';

function createGlobalLights(): {
  ambientLight: AmbientLight;
  sun: DirectionalLight;
} {
  const ambientLight = new AmbientLight(0x404040);
  Scene.scene.add(ambientLight);

  const sun = new DirectionalLight(0x433d4a);
  sun.position.set(-59, 100, 35);
  sun.castShadow = true;
  sun.lookAt(0, 0, 0);
  sun.shadow.mapSize.width = 4096;
  sun.shadow.mapSize.height = 4096;
  sun.shadow.camera.left = 200;
  sun.shadow.camera.right = -200;
  sun.shadow.camera.top = 200;
  sun.shadow.camera.bottom = -200;
  Scene.scene.add(sun);

  return {
    ambientLight,
    sun,
  };
}

export function createSvemir(config: SvemirConfig): Svemir {
  async function run() {
    Loader.run();
    if (config.onReady) {
      await config.onReady();
    }
  }
  async function destroy() {
    stopFrameTick = true;
    Scene.scene.clear();
    spectator.destroy();
  }
  let stopFrameTick = false;

  Renderer.init(config.element, config.renderer);
  Scene.init();
  createGlobalLights();
  PerspectiveCamera.init();
  Renderer.setCamera(PerspectiveCamera.camera);
  Mouse.init();
  Keyboard.init();

  const plane = new Mesh(
    new PlaneGeometry(10, 10, 10, 10),
    new MeshStandardMaterial({
      color: 0xffffff,
    }),
  );
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  Scene.scene.add(plane);

  const spectator = new Spectator(PerspectiveCamera.camera);

  function frameTick() {
    if (stopFrameTick) {
      return;
    }
    requestAnimationFrame(frameTick);
    Ticker.tick();
  }
  if (config.frameTicker) {
    frameTick();
  }
  Ticker.reset();

  return {
    run,
    destroy,
  };
}
