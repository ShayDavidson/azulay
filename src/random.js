// @flow

type RandomFunction = () => number;

export function randomFloat(min: number = 0, max: number = 1, rndFunc: RandomFunction) {
  rndFunc = rndFunc || Math.random;
  return rndFunc() * (max - min) + min;
}

export function randomInteger(min: number = 0, max: number = 1, rndFunc: RandomFunction) {
  rndFunc = rndFunc || Math.random;
  return Math.floor(randomFloat(min, max, rndFunc));
}

export function randomBoolean(rndFunc: RandomFunction) {
  return rndFunc() > 0.5;
}

export function randomSample<T>(array: T[], rndFunc: RandomFunction): T {
  return array[randomInteger(0, array.length, rndFunc)];
}

export function shuffle<T>(array: T[], rndFunc: RandomFunction): T[] {
  const shuffledArray = array.slice(0);
  let counter = shuffledArray.length;

  while (counter > 0) {
    const index = Math.floor(rndFunc() * counter);
    counter--;
    let temp = shuffledArray[counter];
    shuffledArray[counter] = shuffledArray[index];
    shuffledArray[index] = temp;
  }

  return shuffledArray;
}

export function randomWithSeed(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export type RNG = {|
  random: () => number,
  getCounter: () => number
|};

export function createRNG(seed: number): RNG {
  let counter = 0;
  return {
    random(): number {
      return randomWithSeed(seed + counter++);
    },
    getCounter(): number {
      return counter;
    }
  };
}
