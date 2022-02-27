import { PCFSoftShadowMap, WebGLRenderer } from 'three';
import type { PerspectiveCamera } from 'three';
import type { SvemirConfigRenderer } from './types';
import { Scene } from './scene';

export class Renderer {
  static renderer = new WebGLRenderer();
  static width = 0;
  static height = 0;
  static camera: PerspectiveCamera;

  static init(el: HTMLElement, config?: SvemirConfigRenderer) {
    if (!config) {
      config = {};
    }
    this.renderer = new WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = config.shadowMapType || PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    if (config.size) {
      this.renderer.setSize(config.size.width, config.size.height);
      this.width = config.size.width;
      this.height = config.size.height;
    } else {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      let debounce: NodeJS.Timeout;
      window.addEventListener('resize', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          this.width = window.innerWidth;
          this.height = window.innerHeight;
          this.camera.aspect = this.width / this.height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.render();
        }, 200);
      });
    }
    el.appendChild(this.renderer.domElement);
  }

  static setCamera(camera: PerspectiveCamera): void {
    this.camera = camera;
  }

  static render() {
    if (this.camera) {
      this.renderer.render(Scene.scene, this.camera);
    }
  }
}
