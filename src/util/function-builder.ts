import type { Linear2DFn } from '../types';

export class FunctionBuilder {
  static linear2D(points: Array<[number, number]>): Linear2DFn {
    const k: number[] = [];
    const n: number[] = [];

    for (let i = 1; i < points.length; i++) {
      k.push(
        (points[i][1] - points[i - 1][1]) / (points[i][0] - points[i - 1][0]),
      );
      n.push(points[i - 1][1] - k[i - 1] * points[i - 1][0]);
    }

    return (x) => {
      let bestSectionIndex = 0;

      for (let i = 0; i < points.length - 1; i++) {
        if (x >= points[i][0] && x <= points[i + 1][0]) {
          bestSectionIndex = i;
          break;
        }
      }

      return k[bestSectionIndex] * x + n[bestSectionIndex];
    }
  }
}
