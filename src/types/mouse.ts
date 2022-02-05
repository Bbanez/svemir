export interface MouseState {
  left: boolean;
  middle: boolean;
  right: boolean;
  x: number;
  y: number;
}

// eslint-disable-next-line no-shadow
export enum MouseEventType {
  MOUSE_DOWN = 'MOUSE_DOWN',
  MOUSE_UP = 'MOUSE_UP',
  MOUSE_MOVE = 'MOUSE_MOVE',
  ALL = 'ALL',
}

export interface MouseEventCallback {
  (state: MouseState, event: MouseEvent): void;
}

export interface MouseSubscription {
  [id: string]: MouseEventCallback;
}
