export interface KeyboardState {
  [key: string]: boolean;
}

// eslint-disable-next-line no-shadow
export enum KeyboardEventType {
  KEY_UP = 'KEY_UP',
  KEY_DOWN = 'KEY_DOWN',
  ALL = 'ALL',
}

export interface KeyboardEventCallback {
  (state: KeyboardState, event: KeyboardEvent): void;
}

export interface KeyboardUnsubscribe {
  (): void;
}
