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
import { FunctionBuilder } from '.';

interface State {
  ax: number;
  vx: number;
  az: number;
  vz: number;
  ay: number;
  vy: number;
}
// interface State {
//   x: number;
//   y: number;
//   z: number;
// }

export class Spectator {
  private acc = 100;
  private keyboardUpUnsub: KeyboardUnsubscribe;
  private keyboardDownUnsub: KeyboardUnsubscribe;
  private mouseUnsub: MouseUnsubscribe;
  private tickerUnsub: TickerUnsubscribe;
  private state: State = {
    ax: 0,
    vx: 0,
    az: 0,
    vz: 0,
    ay: 0,
    vy: 0,
  };
  private m = 10;
  private c = 0.9;
  private thu = 100;
  private thd = -this.thu;
  private fn = FunctionBuilder.linear2D([
    [-6, -this.m],
    [-5, -this.m],
    [0, 0],
    [5, this.m],
    [6, this.m],
  ]);

  private calc(key: 'ax' | 'ay' | 'az'): void {
    const vKey: 'vx' | 'vy' | 'vz' =
      key === 'ax' ? 'vx' : key === 'ay' ? 'vy' : 'vz';
    // this.state[vKey] = this.state[key];
    const a = 0.001;
    const dumping = 2;
    if (this.state[key] > 0) {
      this.state[vKey] += a;
    } else if (this.state[key] < 0) {
      this.state[vKey] -= a;
    } else {
      if (this.state[vKey] > 0) {
        this.state[vKey] -= a * dumping;
      } else {
        this.state[vKey] += a * dumping;
      }
      if (this.state[vKey] < this.thu && this.state[vKey] > this.thd) {
        this.state[vKey] = 0;
      }
    }
    if (this.state[vKey] !== 0) {
      if (this.state[vKey] > this.m) {
        this.state[vKey] = this.m;
      } else if (this.state[vKey] < -this.m) {
        this.state[vKey] = -this.m;
      }
    }
    // if (this.state[key] < 0 && this.state[vKey] > 0) {
    //   this.state[vKey] *= -1;
    // }
    // if (this.state[vKey] < 0 && this.state[vKey] > this.thd) {
    //   this.state[vKey] = 0;
    // } else if (this.state[vKey] > 0 && this.state[vKey] < this.thu) {
    //   this.state[vKey] = 0;
    // }
  }

  constructor(private camera: PerspectiveCamera) {
    this.keyboardUpUnsub = Keyboard.subscribe(
      KeyboardEventType.KEY_UP,
      (state) => {
        if (!state.w && !state.s) {
          this.state.az = 0;
          // this.state.vz = 0;
        }
        if (!state.a && !state.d) {
          this.state.ax = 0;
          // this.state.vx = 0;
        }
        if (!state.shift && !state[' ']) {
          this.state.ay = 0;
          // this.state.vy = 0;
        }
      },
    );
    this.keyboardDownUnsub = Keyboard.subscribe(
      KeyboardEventType.KEY_DOWN,
      (state) => {
        if (state.w) {
          this.state.az = -this.acc;
        } else if (state.s) {
          this.state.az = this.acc;
        }
        if (state.a) {
          this.state.ax = -this.acc;
        } else if (state.d) {
          this.state.ax = this.acc;
        }
        if (state.shift) {
          this.state.ay = -this.acc;
        } else if (state[' ']) {
          this.state.ay = this.acc;
        }
      },
    );
    this.mouseUnsub = Mouse.subscribe(MouseEventType.ALL, (state) => {
      if (state.left) {
        this.camera.rotateX((-state.delta.y / 500) * (this.state.vx + 1));
        this.camera.rotateOnWorldAxis(
          new Vector3(0, 1, 0),
          -state.delta.x / 800,
        );
      }
    });
    this.tickerUnsub = Ticker.subscribe(() => {
      this.calc('az');
      this.calc('ay');
      this.calc('ax');
      this.camera.translateZ(this.state.vz);
      this.camera.translateX(this.state.vx);
      this.camera.translateY(this.state.vy);
      // if (this.state.az !== 0) {
      //   this.camera.translateZ(this.state.vz);
      // }
      // if (this.state.ax !== 0) {
      //   this.camera.translateX(this.state.vx);
      // }
      // if (this.state.ay !== 0) {
      //   this.camera.translateY(this.state.vy);
      // }
    });
  }

  destroy() {
    this.keyboardDownUnsub();
    this.keyboardUpUnsub();
    this.tickerUnsub();
    this.mouseUnsub();
  }
}
