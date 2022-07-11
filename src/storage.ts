import type { LSItems } from './types';

function getKey(key: string): string {
  return `${LS.prefix}${key}`;
}

export class LS {
  static prefix: string;
  static get<Data = string>(key: string, json?: boolean): Data | string | null {
    const result = localStorage.getItem(getKey(key));
    if (!result) {
      return null;
    }
    if (json) {
      return JSON.parse(result);
    }
    return result;
  }
  static set<Data = string>(key: string, value: Data): void {
    if (typeof value === 'object') {
      localStorage.setItem(getKey(key), JSON.stringify(value));
    } else {
      localStorage.setItem(getKey(key), `${value}`);
    }
  }
  static remove(key: string | string[]): void {
    if (key instanceof Array) {
      for (let i = 0; i < key.length; i++) {
        const k = key[i];
        localStorage.removeItem(getKey(k));
      }
    } else {
      localStorage.removeItem(getKey(key));
    }
  }
  static items(): LSItems {
    const data: LSItems = JSON.parse(JSON.stringify(localStorage));
    const output: LSItems = {};
    for (const key in data) {
      if (key.startsWith(LS.prefix)) {
        output[key] = data[key];
      }
    }
    return output;
  }
  static clear(): void {
    const data = JSON.parse(JSON.stringify(localStorage));
    for (const key in data) {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
}
