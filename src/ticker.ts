import { v4 as uuidv4 } from 'uuid';
import { Renderer } from '.';
import type { TickerCallback } from './types';

export class Ticker {
  private static subs: {
    [id: string]: TickerCallback;
  } = {};
  private static time = Date.now();
  private static timeDelta = 0;

  static tick() {
    this.timeDelta = Date.now() - this.time;
    this.time = Date.now();
    for (const id in this.subs) {
      this.subs[id](this.time, this.timeDelta);
    }
    Renderer.render();
  }
  static reset() {
    this.time = Date.now();
    this.timeDelta = 0;
  }
  static subscribe(callback: TickerCallback): () => void {
    const id = uuidv4();
    this.subs[id] = callback;
    return () => {
      delete this.subs[id];
    };
  }
  static clear() {
    const ids = Object.keys(this.subs);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      delete this.subs[id];
    }
  }
}
