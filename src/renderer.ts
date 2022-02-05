import { PCFSoftShadowMap, WebGLRenderer } from 'three';
import type { Camera } from 'three';
import type { SvemirConfigRenderer } from './types';
import { Scene } from './scene';

export class Renderer {
  static renderer = new WebGLRenderer();
  static width = 0;
  static height = 0;
  private static camera: Camera;

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
      window.addEventListener('resize', () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
    el.appendChild(this.renderer.domElement);
  }

  static setCamera(camera: Camera): void {
    this.camera = camera;
  }

  static render() {
    this.renderer.render(Scene.scene, this.camera);
  }
}
