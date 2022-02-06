import { Point2D, Point3D } from './point';

export class Vector2D {
  /**
   * Angle of a vector with x-axis
   */
  public a = 0;
  /**
   * Position of a vector.
   */
  public p: Point2D;
  /**
   * Position of the end of a vector.
   */
  public p2: Point2D;
  /**
   * Intensity of a vector
   */
  public s = 0;

  constructor(config: {
    position: Point2D;
    strength?: number;
    angle?: number;
    toPosition?: Point2D;
  }) {
    this.p = config.position;
    if (config.toPosition) {
      this.p2 = config.toPosition;
      this.calcS();
      const x = this.p.x - config.toPosition.x;
      const y = this.p.y - config.toPosition.y;
      this.s = Math.sqrt(x * x + y * y);
      this.a = Math.acos(this.s / x);
    } else {
      if (config.strength) {
        this.s = config.strength;
      }
      if (config.angle) {
        this.a = config.angle;
      }
      this.p2 = new Point2D(
        this.s * Math.cos(this.a) + this.p.x,
        this.s * Math.sin(this.a) + this.p.y,
      );
    }
  }

  private calcS(): void {
    const x = this.p.x - this.p2.x;
    const y = this.p.y - this.p2.y;
    this.s = Math.sqrt(x * x + y * y);
  }
  private calcP2(): void {
    this.p2.set(
      this.s * Math.cos(this.a) + this.p.x,
      this.s * Math.sin(this.a) + this.p.y,
    );
  }
  public vecTo(position: Point2D): Vector2D {
    const x = this.p.x - position.x;
    const y = this.p.y - position.y;
    const strength = Math.sqrt(x * x + y * y);
    const angle = Math.acos(strength / x);

    return new Vector2D({ position: this.p, strength, angle });
  }
  public setX(x: number): void {
    this.p.setX(x);
    this.calcP2();
  }
  public setY(y: number): void {
    this.p.setY(y);
    this.calcP2();
  }
  public setPosition(x: number, y: number): void {
    this.p.set(x, y);
    this.calcP2();
  }
  public moveBy(x: number, y: number): void {
    this.p.set(this.p.x + x, this.p.y + y);
    this.p2.set(this.p2.x + x, this.p2.y + y);
  }
  public setAngle(angle: number): void {
    this.a = angle;
    this.calcP2();
  }
  public rotateBy(angle: number): void {
    this.a += angle;
    this.calcP2();
  }
  public setStrength(strength: number): void {
    this.s = strength;
    this.calcP2();
  }
  public changeStrengthBy(strength: number): void {
    this.s += strength;
    this.calcP2();
  }
}

export class Vector3D {
  /**
   * Angle of a vector with x-axis
   */
  public a = 0;
  /**
   * Angle of a vector with z-axis
   */
  public b = 0;
  /**
   * Position of a vector.
   */
  public p: Point3D;
  /**
   * Position of the end of a vector.
   */
  public p2: Point3D;
  /**
   * Intensity of a vector
   */
  public s = 0;

  constructor(config: {
    position: Point3D;
    strength?: number;
    angleWithX?: number;
    angleWithZ?: number;
    toPosition?: Point3D;
  }) {
    this.p = config.position;
    if (config.toPosition) {
      this.p2 = config.toPosition;
      this.calcS();
      const x = this.p.x - config.toPosition.x;
      const y = this.p.y - config.toPosition.y;
      this.s = Math.sqrt(x * x + y * y);
      this.a = Math.acos(this.s / x);
    } else {
      if (config.strength) {
        this.s = config.strength;
      }
      if (config.angleWithX) {
        this.a = config.angleWithX;
      }
      if (config.angleWithZ) {
        this.b = config.angleWithZ;
      }
      this.p2 = new Point3D(
        this.s * Math.cos(this.a) + this.p.x,
        this.s * Math.sin(this.a) + this.p.y,
        this.s * Math.cos(this.b) + this.p.y,
      );
    }
  }

  private calcS(): void {
    const x = this.p.x - this.p2.x;
    const y = this.p.y - this.p2.y;
    const d = Math.sqrt(x * x + y * y);
    const z = this.p.z - this.p2.z;
    this.s = Math.sqrt(d * d + z * z);
  }
  private calcP2(): void {
    this.p2.set(
      this.s * Math.cos(this.a) + this.p.x,
      this.s * Math.sin(this.a) + this.p.y,
      this.s * Math.cos(this.b) + this.p.z,
    );
  }
  public vecTo(position: Point2D): Vector2D {
    const x = this.p.x - position.x;
    const y = this.p.y - position.y;
    const strength = Math.sqrt(x * x + y * y);
    const angle = Math.acos(strength / x);

    return new Vector2D({ position: this.p, strength, angle });
  }
  public setX(x: number): void {
    this.p.setX(x);
    this.calcP2();
  }
  public setY(y: number): void {
    this.p.setY(y);
    this.calcP2();
  }
  public setPosition(x: number, y: number): void {
    this.p.set(x, y);
    this.calcP2();
  }
  public moveBy(x: number, y: number): void {
    this.p.set(this.p.x + x, this.p.y + y);
    this.p2.set(this.p2.x + x, this.p2.y + y);
  }
  public setAngle(angle: number): void {
    this.a = angle;
    this.calcP2();
  }
  public rotateBy(angle: number): void {
    this.a += angle;
    this.calcP2();
  }
  public setStrength(strength: number): void {
    this.s = strength;
    this.calcP2();
  }
  public changeStrengthBy(strength: number): void {
    this.s += strength;
    this.calcP2();
  }
}
