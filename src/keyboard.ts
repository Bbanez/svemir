import { v4 as uuidv4 } from 'uuid';
import type {
  KeyboardEventCallback,
  KeyboardState,
  KeyboardUnsubscribe,
} from './types';
import { KeyboardEventType } from './types';

export class Keyboard {
  private static subs: {
    [id: string]: {
      type: KeyboardEventType;
      cb: KeyboardEventCallback;
    };
  } = {};
  static state: KeyboardState = {};

  private static trigger(type: KeyboardEventType, event: KeyboardEvent) {
    for (const id in Keyboard.subs) {
      const sub = Keyboard.subs[id];
      if (sub.type === type || sub.type === KeyboardEventType.ALL) {
        sub.cb(Keyboard.state, event);
      }
    }
  }
  private static onKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (!Keyboard.state[key]) {
      Keyboard.state[key] = true;
      Keyboard.trigger(KeyboardEventType.KEY_DOWN, event);
    }
  }
  private static onKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (Keyboard.state[key]) {
      Keyboard.state[key] = false;
      Keyboard.trigger(KeyboardEventType.KEY_UP, event);
    }
  }
  static init() {
    window.addEventListener('keydown', Keyboard.onKeyDown);
    window.addEventListener('keyup', Keyboard.onKeyUp);
  }
  static destroy() {
    window.removeEventListener('keydown', Keyboard.onKeyDown);
    window.removeEventListener('keyup', Keyboard.onKeyUp);
  }
  static subscribe(
    type: KeyboardEventType,
    callback: KeyboardEventCallback,
  ): KeyboardUnsubscribe {
    const id = uuidv4();
    Keyboard.subs[id] = {
      type,
      cb: callback,
    };
    return () => {
      delete Keyboard.subs[id];
    };
  }
}
