// @flow

export function randomWithSeed(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export type RNG = {|
  int: (min: number, max: number) => number,
  shuffle: (array: Array<any>) => Array<any>,
  getCounter: () => number
|};

export function createRNG(seed: number, counter: number = 0): RNG {
  return {
    int(min: number = 0, max: number = 1): number {
      return Math.floor(randomWithSeed(seed + counter++) * (max - min) + min);
    },
    shuffle(array: Array<any>): Array<any> {
      const shuffledArray = array.slice(0);
      let counter = shuffledArray.length;

      while (counter > 0) {
        const index = this.int(0, counter);
        counter--;
        let temp = shuffledArray[counter];
        shuffledArray[counter] = shuffledArray[index];
        shuffledArray[index] = temp;
      }
      return shuffledArray;
    },
    getCounter(): number {
      return counter;
    }
  };
}
