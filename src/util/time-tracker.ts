import { Logger } from '../logger';

export class TimeTracker {
  static get track() {
    return {
      timeToComplete<Result>(
        message: string,
        fn: () => Result | Promise<Result>,
      ): Result | Promise<Result> {
        Logger.log(message);
        const timeOffset = Date.now();
        return new Promise((resolve, reject) => {
          const res = fn();
          if (res instanceof Promise) {
            res
              .then((output) => {
                Logger.log(
                  `${message} done in ${(Date.now() - timeOffset) / 1000}s`,
                );
                resolve(output);
              })
              .catch((err) => {
                Logger.log(
                  `${message} failed after ${
                    (Date.now() - timeOffset) / 1000
                  }s`,
                );
                reject(err);
              });
          } else {
            Logger.log(
              `${message} done in ${(Date.now() - timeOffset) / 1000}s`,
            );
            resolve(res);
          }
        });
      },
    };
  }
}
