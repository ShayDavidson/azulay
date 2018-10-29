// @flow

export function randomWithSeed(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export type RNG = {|
  int: (min: number, max: number) => number,
  getCounter: () => number
|};

export function createRNG(seed: number, counter: number = 0): RNG {
  return {
    int(min: number = 0, max: number = 1): number {
      return Math.floor(randomWithSeed(seed + counter++) * (max - min) + min);
    },
    getCounter(): number {
      return counter;
    }
  };
}
