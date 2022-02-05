import { v4 as uuidv4 } from 'uuid';
import { MouseEventType } from './types';
import type {
  MouseSubscription,
  MouseEventCallback,
  MouseState,
} from './types';

export class Mouse {
  static state: MouseState = {
    left: false,
    middle: false,
    right: false,
    x: 0,
    y: 0,
  };
  private static subs: {
    [MouseEventType.ALL]: MouseSubscription;
    [MouseEventType.MOUSE_DOWN]: MouseSubscription;
    [MouseEventType.MOUSE_MOVE]: MouseSubscription;
    [MouseEventType.MOUSE_UP]: MouseSubscription;
  } = {
    [MouseEventType.ALL]: {},
    [MouseEventType.MOUSE_DOWN]: {},
    [MouseEventType.MOUSE_MOVE]: {},
    [MouseEventType.MOUSE_UP]: {},
  };

  private static trigger(type: MouseEventType, event: MouseEvent) {
    for (const id in Mouse.subs[type]) {
      const sub = Mouse.subs[type][id];
      sub(Mouse.state, event);
    }
    for (const id in Mouse.subs[MouseEventType.ALL]) {
      const sub = Mouse.subs[type][id];
      sub(Mouse.state, event);
    }
  }
  private static onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      if (!Mouse.state.left) {
        Mouse.state.left = true;
        Mouse.trigger(MouseEventType.MOUSE_DOWN, event);
      }
    } else if (event.button === 1) {
      if (!Mouse.state.middle) {
        Mouse.state.middle = true;
        Mouse.trigger(MouseEventType.MOUSE_DOWN, event);
      }
    } else if (event.button === 2) {
      if (!Mouse.state.right) {
        Mouse.state.right = true;
        Mouse.trigger(MouseEventType.MOUSE_DOWN, event);
      }
    }
  }
  private static onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      if (Mouse.state.left) {
        Mouse.state.left = false;
        Mouse.trigger(MouseEventType.MOUSE_DOWN, event);
      }
    } else if (event.button === 1) {
      if (Mouse.state.middle) {
        Mouse.state.middle = false;
        Mouse.trigger(MouseEventType.MOUSE_DOWN, event);
      }
    } else if (event.button === 2) {
      if (Mouse.state.right) {
        Mouse.state.right = false;
        Mouse.trigger(MouseEventType.MOUSE_DOWN, event);
      }
    }
  }
  private static onMouseMove(event: MouseEvent) {
    Mouse.state.x = event.clientX;
    Mouse.state.y = event.clientY;
    Mouse.trigger(MouseEventType.MOUSE_MOVE, event);
  }
  private static onContext(event: MouseEvent) {
    event.preventDefault();
  }

  static init() {
    window.addEventListener('mousedown', Mouse.onMouseDown);
    window.addEventListener('mouseup', Mouse.onMouseUp);
    window.addEventListener('mousemove', Mouse.onMouseMove);
    window.addEventListener('contextmenu', Mouse.onContext);
  }
  static destroy() {
    window.removeEventListener('mousedown', Mouse.onMouseDown);
    window.removeEventListener('mouseup', Mouse.onMouseUp);
    window.removeEventListener('mousemove', Mouse.onMouseMove);
    window.removeEventListener('contextmenu', Mouse.onContext);
  }
  static subscribe(
    type: MouseEventType,
    callback: MouseEventCallback,
  ): () => void {
    const id = uuidv4();
    Mouse.subs[type][id] = callback;

    return () => {
      delete Mouse.subs[type][id];
    };
  }
}
