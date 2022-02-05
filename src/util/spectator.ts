import type { Camera } from 'three';
import { Keyboard } from '../keyboard';
import type { KeyboardUnsubscribe } from '../types';
import { KeyboardEventType } from '../types';

export class Spectator {
  private keyboardUnsub: KeyboardUnsubscribe;

  constructor(private camera: Camera) {
    this.keyboardUnsub = Keyboard.subscribe(KeyboardEventType.ALL, (state) => {
      console.log(state);
    });
  }

  destroy() {
    this.keyboardUnsub();
  }
}
