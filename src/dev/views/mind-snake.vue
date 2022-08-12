<script lang="tsx">
import {
  BoxGeometry,
  CubeTexture,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
} from 'three';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { PI12 } from '../../consts';
import { Keyboard } from '../../keyboard';
import { Loader } from '../../loader';
import { createSvemir } from '../../main';
import { Renderer } from '../../renderer';
import { Scene } from '../../scene';
import { KeyboardEventType, Svemir } from '../../types';

const component = defineComponent({
  setup() {
    const container = ref<HTMLDivElement | null>(null);
    const game = ref<Svemir>();

    onMounted(async () => {
      game.value = createSvemir({
        element: container.value as HTMLElement,
        frameTicker: true,
        onReady: async () => {
          const dirLight = new DirectionalLight(0xffffff, 1);
          dirLight.position.set(5, 5, 5);
          dirLight.lookAt(0, 0, 0);
          Scene.scene.add(dirLight);
          dirLight.castShadow = true;
          // dirLight.shadow.mapSize.width = 256;
          // dirLight.shadow.mapSize.height = 256;
          // dirLight.shadow.camera.left = 10;
          // dirLight.shadow.camera.right = -10;
          // dirLight.shadow.camera.top = 10;
          // dirLight.shadow.camera.bottom = -10;

          const plane = new Mesh(
            new PlaneGeometry(10, 10),
            new MeshStandardMaterial({
              color: 0xeeeeee,
            }),
          );
          // plane.rotateX(PI34);

          Scene.scene.add(plane);
          plane.castShadow = false;
          plane.receiveShadow = true;
          plane.rotation.x = -PI12;

          const head = new Mesh(
            new BoxGeometry(0.1, 0.1, 0.1),
            new MeshStandardMaterial({
              color: 0xaa9900,
            }),
          );
          head.position.y = 0.2;
          head.castShadow = true;
          head.receiveShadow = true;
          Scene.scene.add(head);

          Keyboard.subscribe(KeyboardEventType.KEY_DOWN, (state) => {
            
          })

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

          // new Spectator(camera);

          Keyboard.subscribe(KeyboardEventType.KEY_DOWN, (state) => {
            console.log({ state });

          });
        },
      });
      const camera = new PerspectiveCamera();
      camera.position.set(0, 15, 0);
      camera.lookAt(0, 0, 0);
      Renderer.setCamera(camera);


      await game.value.run();
    });
    onUnmounted(() => {
      if (game.value) {
        game.value.destroy();
      }
    });

    return () => (
      <div>
        <div ref={container} />
      </div>
    );
  },
});
export default component;
</script>
