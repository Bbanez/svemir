import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from 'three';
import type { Point2D } from '../../../math';
import { Scene } from '../../../scene';
import { FunctionBuilder } from '../../../util';
import type { Obstacle } from './obstacle';
import type { ObstacleIntersections } from './types';

export class PathFinder {
  public static obstacles: Obstacle[] = [];

  static resolve(origin: Point2D, target: Point2D): Point2D[] {
    console.log(this.obstacles);
    const p: Point2D[] = [origin, target];
    let pFn = FunctionBuilder.linear2D([
      [origin.x, origin.z],
      [target.x, target.z],
    ]);
    let n = 0;
    let loop = true;
    interface MatchingQ {
      q: Obstacle;
      intersections: ObstacleIntersections;
    }
    let loopCount = 0;
    while (loop) {
      console.log(loopCount);
      const areaX = [0, 0];
      const areaZ = [0, 0];
      if (p[n].x < p[n + 1].x) {
        areaX[0] = p[n].x;
        areaX[1] = p[n + 1].x;
      } else {
        areaX[0] = p[n + 1].x;
        areaX[1] = p[n].x;
      }
      if (p[n].z < p[n + 1].z) {
        areaZ[0] = p[n].z;
        areaZ[1] = p[n + 1].z;
      } else {
        areaZ[0] = p[n + 1].z;
        areaZ[1] = p[n].z;
      }
      const matchingQs: MatchingQ[] = [];
      for (let i = 0; i < this.obstacles.length; i++) {
        const o = this.obstacles[i];
        const inters = o.getIntersections(p[n], pFn);
        let add = false;
        for (let k = 0; k < inters.length; k++) {
          const inter = inters[k];
          if (inter) {
            if (
              (inter.x >= areaX[0] &&
                inter.x <= areaX[1] &&
                inter.z >= areaZ[0] &&
                inter.z <= areaZ[1]) ||
              (o.q.x >= areaX[0] &&
                o.q.x <= areaX[1] &&
                o.q.z >= areaZ[0] &&
                o.q.z <= areaZ[1])
            ) {
              add = true;
              break;
            }
          }
        }
        if (add) {
          matchingQs.push({
            q: o,
            intersections: inters,
          });
        }
        // for (let k = 0; k < o.corners.length; k++) {
        //   const c = o.corners[k];
        //   if (
        //     (c.x >= areaX[0] &&
        //       c.x <= areaX[1] &&
        //       c.z >= areaZ[0] &&
        //       c.z <= areaZ[1]) ||
        //     (o.q.x >= areaX[0] &&
        //       o.q.x <= areaX[1] &&
        //       o.q.z >= areaZ[0] &&
        //       o.q.z <= areaZ[1])
        //   ) {
        //     obstacles.push(o);
        //     break;
        //   }
        // }
      }
      if (matchingQs.length > 0) {
        let minDist = 10000000000;
        let bestMatchIdx = -1;
        for (let i = 0; i < matchingQs.length; i++) {
          const matchingQ = matchingQs[i];
          const dist = p[n].distanceFrom(
            matchingQ.intersections[0]
              ? matchingQ.intersections[0]
              : (matchingQ.intersections[1] as Point2D),
          );
          if (dist < minDist) {
            minDist = dist;
            bestMatchIdx = i;
          }
        }
        console.log({ bestMatchIdx });
        if (bestMatchIdx === -1) {
          loop = false;
        } else {
          const q = matchingQs[bestMatchIdx];
          for (let k = 0; k < q.intersections.length; k++) {
            const inter = q.intersections[k];
            if (inter) {
              const cb = new Mesh(
                new BoxBufferGeometry(0.1, 26, 0.1),
                new MeshStandardMaterial({
                  color: k === 0 ? 0x1100ff : 0x00ffff,
                }),
              );
              cb.position.set(inter.x, 0, inter.z);
              Scene.scene.add(cb);
              setTimeout(() => {
                Scene.scene.remove(cb);
              }, 2000);
            }
          }
          let corner: Point2D | null;
          if (q.intersections[0]) {
            corner = q.q.getClosestCorner(q.intersections[0]);
          } else if (q.intersections[1]) {
            corner = q.q.getClosestCorner(q.intersections[1]);
          } else {
            loop = false;
            break;
          }
          if (corner.isEqual(p[n])) {
            loop = false;
            break;
          }
          p.splice(n + 1, 0, corner);
          n++;
          pFn = FunctionBuilder.linear2D([
            [p[n].x, p[n].z],
            [target.x, target.z],
          ]);
        }
      } else {
        loop = false;
      }
      loopCount++;
      if (loopCount > 1000) {
        throw Error('Loop count limit');
      }
    }
    console.log({ loopCount });
    return p.slice(1);
  }
}
