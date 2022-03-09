<script lang="tsx">
import {
  CubeTexture,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { createSvemir } from '..';
import { Loader } from '../loader';
import { Renderer } from '../renderer';
import { Scene } from '../scene';
import { Ticker } from '../ticker';
import type { Svemir } from '../types';
import { Spectator } from '../util';
import { Shader } from './shaders';

const component = defineComponent({
  setup() {
    const container = ref<HTMLDivElement | null>(null);
    let game: Svemir;

    onMounted(async () => {
      const game = createSvemir({
        element: container.value as HTMLElement,
        frameTicker: true,
        onReady: async () => {
          const dirLight = new DirectionalLight(0xffffff, 0.5);
          Scene.scene.add(dirLight);
          const plane = new Mesh(
            new PlaneGeometry(10, 10, 10, 10),
            new MeshStandardMaterial({
              color: 0xffffff,
            }),
          );
          plane.castShadow = false;
          plane.receiveShadow = true;
          plane.rotation.x = -Math.PI / 2;
          plane.translateZ(-1);
          // Scene.scene.add(plane);

          const sun = new Mesh(
            new SphereGeometry(1),
            new ShaderMaterial({
              uniforms: {
                sphereColor: {
                  value: new Vector3(0, 0, 1),
                },
                dt: {
                  value: 0,
                },
              },
              vertexShader: Shader.load('sunV'),
              fragmentShader: Shader.load('sunF'),
            }),
          );
          let dt = 0;
          Ticker.subscribe((cTime) => {
            const r = Math.cos(cTime / 1000) * 0.5 + 0.5;
            const b = Math.sin(cTime / 1000) * 0.5 + 0.5;
            dt += 0.0005;
            sun.rotation.y += 0.001;
            sun.material.uniforms.dt.value = dt;
            sun.material.uniforms.sphereColor.value = new Vector3(r, 0, b);
          });
          sun.castShadow = true;
          Scene.scene.add(sun);

          Loader.onLoaded((_item, data) => {
            Scene.scene.background = data as CubeTexture;
          });
          Loader.register([
            {
              path: [
                '/assets/skybox/xn.png',
                '/assets/skybox/xp.png',
                '/assets/skybox/yp.png',
                '/assets/skybox/yn.png',
                '/assets/skybox/zp.png',
                '/assets/skybox/zn.png',
              ],
              name: 'skybox',
              type: 'cubeTexture',
            },
          ]);
          await Loader.run();

          new Spectator(camera);
        },
      });
      const camera = new PerspectiveCamera();
      camera.position.set(2, 2, 10);
      camera.lookAt(0, 0, 0);
      Renderer.setCamera(camera);
      await game.run();
    });

    onUnmounted(() => {
      if (game) {
        game.destroy();
      }
    });

    return () => <div ref={container} />;
  },
});
export default component;
</script>
