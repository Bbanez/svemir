import { PerspectiveCamera, Vector3 } from 'three';
import { Mouse } from '../mouse';
import { Keyboard } from '../keyboard';
import type {
  KeyboardUnsubscribe,
  MouseUnsubscribe,
  TickerUnsubscribe,
} from '../types';
import { KeyboardEventType, MouseEventType } from '../types';
import { Ticker } from '../ticker';

export class Spectator {
  private acc = 0.1;
  private keyboardUpUnsub: KeyboardUnsubscribe;
  private keyboardDownUnsub: KeyboardUnsubscribe;
  private mouseUnsub: MouseUnsubscribe;
  private tickerUnsub: TickerUnsubscribe;
  private state: {
    x: number;
    z: number;
  } = {
    x: 0,
    z: 0,
  };

  constructor(private camera: PerspectiveCamera) {
    this.keyboardUpUnsub = Keyboard.subscribe(
      KeyboardEventType.KEY_UP,
      (state) => {
        if (!state.w && !state.s) {
          this.state.z = 0;
        }
        if (!state.a && !state.d) {
          this.state.x = 0;
        }
      },
    );
    this.keyboardDownUnsub = Keyboard.subscribe(
      KeyboardEventType.KEY_DOWN,
      (state) => {
        if (state.w) {
          this.state.z = -this.acc;
        } else if (state.s) {
          this.state.z = this.acc;
        }
        if (state.a) {
          this.state.x = -this.acc;
        } else if (state.d) {
          this.state.x = this.acc;
        }
      },
    );
    this.mouseUnsub = Mouse.subscribe(MouseEventType.ALL, (state) => {
      if (state.left) {
        this.camera.rotateX(-state.delta.y / 500);
        this.camera.rotateOnWorldAxis(
          new Vector3(0, 1, 0),
          -state.delta.x / 800,
        );
      }
    });
    this.tickerUnsub = Ticker.subscribe(() => {
      if (this.state.z !== 0) {
        this.camera.translateZ(this.state.z);
      }
      if (this.state.x !== 0) {
        this.camera.translateX(this.state.x);
      }
    });
  }

  destroy() {
    this.keyboardDownUnsub();
    this.keyboardUpUnsub();
    this.tickerUnsub();
    this.mouseUnsub();
  }
}
