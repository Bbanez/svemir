import { Vector2D } from './vector';

export class Point2D {
  constructor(public x: number, public y: number) {}

  public distanceFrom(point: Point2D): number {
    const x = this.x - point.x;
    const y = this.y - point.y;
    return Math.sqrt(x * x + y * y);
  }
  public distanceToVector(point: Point2D): Vector2D {
    const x = this.x - point.x;
    const y = this.y - point.y;
    const strength = Math.sqrt(x * x + y * y);
    const angle = Math.acos(strength / x);

    return new Vector2D({ position: point, strength, angle });
  }
  public setX(x: number): void {
    this.x = x;
  }
  public setY(y: number): void {
    this.y = y;
  }
  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class Point3D {
  constructor(public x: number, public y: number, public z: number) {}

  public distanceFrom(point: Point3D): number {
    const x = this.x - point.x;
    const y = this.y - point.y;
    const d = Math.sqrt(x * x + y * y);
    const z = this.z - point.z;
    return Math.sqrt(d * d + z * z);
  }
  public setX(x: number): void {
    this.x = x;
  }
  public setY(y: number): void {
    this.y = y;
  }
  public setZ(z: number): void {
    this.z = z;
  }
  public set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
