// @flow

import { createRNG } from "./random";
import type { RNG } from "./random";

// CONSTS ////////////////////////////

export const COLORS = 5;
export const FLOOR_SLOTS = [-1, -1, -2, -2, -2, -3, -3];
export const FACTORIES_BY_PLAYERS = [0, 0, 5, 7, 9];
export const TILES_PER_COLOR = 20;
export const ROW_BONUS = 2;
export const COL_BONUS = 7;
export const COLOR_BONUS = 10;
export const FACTORY_MAX_TILES = 4;
export const PHASES = {
  refill: "refill",
  placement: "placement",
  scoring: "scoring"
};
export const PLAYER_TYPE = {
  human: "human",
  cpu: "cpu"
};

// TYPES ////////////////////////////

export type RandomProps = {|
  seed: number,
  counter: number
|};

export type ColorType = number;

export type WallPlacement = boolean;

export type Wall = Array<Array<WallPlacement>>;

export type Staging = Array<StagingRow>;

export type Floor = Array<?ColorType>;

export type PlayerType = $Keys<typeof PLAYER_TYPE>;

export type Board = {|
  wall: Wall,
  staging: Staging,
  floor: Floor
|};

export type StagingRow = {|
  color: ?ColorType,
  count: number
|};

export type Player = {|
  score: number,
  board: Board,
  type: PlayerType,
  name: string
|};

export type ColorBundle = {|
  color: ColorType,
  count: number
|};

export type TilesColorCounter = Array<number>;

export type Factory = TilesColorCounter;

export type Phase = $Keys<typeof PHASES>;

export type Game = {|
  players: Array<Player>,
  bag: TilesColorCounter,
  box: TilesColorCounter,
  factories: Array<TilesColorCounter>,
  leftovers: TilesColorCounter,
  turn: number,
  currentPlayer: number,
  phase: Phase,
  randomProps: RandomProps
|};

// FACTORIES ////////////////////////////

export function createGame(players: number, seed: number): Game {
  let rng = createRNG(seed);
  return {
    players: [...Array(players)].map((_, index) => createPlayer(`Player ${index}`, "human")),
    bag: createColorCountArray(TILES_PER_COLOR),
    box: createColorCountArray(0),
    factories: [...Array(FACTORIES_BY_PLAYERS[players])].map(() => createColorCountArray(0)),
    leftovers: createColorCountArray(0),
    turn: 0,
    currentPlayer: rng.int(0, players - 1),
    phase: PHASES.refill,
    randomProps: { seed, counter: rng.getCounter() }
  };
}

export function createColorCountArray(count: number): TilesColorCounter {
  return new Array(COLORS).fill(count);
}

export function createPlayer(name: string, type: PlayerType): Player {
  return {
    score: 0,
    board: createBoard(),
    type,
    name
  };
}

export function createBoard(): Board {
  return {
    wall: createWall(),
    staging: [...new Array(COLORS)],
    floor: [...new Array(FLOOR_SLOTS.length)]
  };
}

export function createWall(): Wall {
  let wall = new Array(COLORS);
  for (let row = 0; row < COLORS; row++) {
    wall[row] = new Array(COLORS);
    for (let col = 0; col < COLORS; col++) {
      wall[row][col] = false;
    }
  }
  return wall;
}

// ACTIONS ////////////////////////////

export function drawTileFromBag(game: Game): Game {
  let rng = createRNG(game.randomProps.seed, game.randomProps.counter);
  let pickedColor = getRandomTileFromColorCounter(game.bag, rng);
  if (pickedColor != undefined) {
    let bag = getCounterWithNewValue(game.bag, pickedColor, game.bag[pickedColor] - 1);
    let factories = game.factories.map(
      factory =>
        isFactoryFull(factory) ? factory : getCounterWithNewValue(factory, pickedColor, factory[pickedColor] + 1)
    );
    let randomProps = { ...game.randomProps, counter: rng.getCounter() };
    return { ...game, bag, factories, randomProps };
  } else {
    return game;
  }
}

// INTERNAL ACTIONS ////////////////////////////

function placeTileInWall(wall: Wall, fromStagingRowIndex: number, tileColor: ColorType): Wall {
  let tileWallRow = fromStagingRowIndex;
  let tileWallCol = getWallPlacementCol(tileWallRow, tileColor);
  return wall.map(
    (wallRow, wallRowIndex) =>
      wallRowIndex == tileWallRow
        ? wallRow.slice.map((_, wallColIndex) => wallColIndex == tileWallCol)
        : wallRow.slice()
  );
}

// CALCULATIONS ////////////////////////////

export function calculateBoardAddedScore(board: Board): number {
  return board.staging.reduce((score, stagingRow, stagingRowIndex) => {
    if (isStagingRowFull(stagingRow, stagingRowIndex)) {
      let placementColor = stagingRow.color;
      if (placementColor != undefined) {
        let newWall = placeTileInWall(board.wall, stagingRowIndex, placementColor);
        let placementRow = stagingRowIndex;
        let placementCol = getWallPlacementCol(placementRow, placementColor);
        return score + calculateTilePlacementScore(newWall, placementRow, placementCol);
      } else {
        return score;
      }
    } else {
      return score;
    }
  }, 0);
}

export function calculateTilePlacementScore(wall: Wall, placementRow: number, placementCol: number): number {
  var rowScore = 0;
  var encounteredTileInRow = false;
  for (let col = 0; col < COLORS; col++) {
    let inPlacement = col == placementCol;
    if (inPlacement) {
      encounteredTileInRow = true;
    }
    if (inPlacement || wall[placementRow][col]) {
      rowScore += 1;
    } else if (encounteredTileInRow) {
      break;
    } else {
      rowScore = 0;
    }
  }

  var colScore = 0;
  var encounteredTileInCol = false;
  for (let row = 0; row < COLORS; row++) {
    let inPlacement = row == placementRow;
    if (inPlacement) {
      encounteredTileInRow = true;
    }
    if (inPlacement || wall[row][placementCol]) {
      colScore += 1;
    } else if (encounteredTileInCol) {
      break;
    } else {
      colScore = 0;
    }
  }

  return rowScore + colScore;
}

// IMMUTATORS /////////////////////////

export function getCounterWithNewValue(counter: TilesColorCounter, color: ColorType, value: number): TilesColorCounter {
  return counter.map((count, index) => (index == color ? value : count));
}

// HELPERS ////////////////////////////

export function isStagingRowFull(stagingRow: ?StagingRow, index: number): boolean {
  if (stagingRow == undefined) {
    return false;
  } else {
    return stagingRow.count == index + 1;
  }
}

export function isFactoryFull(factory: TilesColorCounter): boolean {
  return getTilesInColorCounter(factory) == FACTORY_MAX_TILES;
}

export function placementsForStagingRow(index: number): number {
  return index + 1;
}

export function getWallPlacementCol(row: number, color: ColorType): number {
  return (row + color) % COLORS;
}

export function getWallPlacementColor(row: number, col: number): ColorType {
  return (col + row) % COLORS;
}

export function getTilesInColorCounter(counter: TilesColorCounter): number {
  return counter.reduce((a, b) => a + b, 0);
}

export function getRandomTileFromColorCounter(counter: TilesColorCounter, rng: RNG): ?ColorType {
  if (getTilesInColorCounter(counter) > 0) {
    while (true) {
      let random = rng.int(0, counter.length);
      if (counter[random] > 0) return random;
    }
  } else {
    return undefined;
  }
}

export function reduceColorCounterToArray(counter: TilesColorCounter): Array<Color> {
  if (counter == undefined) return [];
  return counter.reduce((array, count, colorIndex) => {
    for (let i = 0; i < count; i++) {
      array.push(colorIndex);
    }
    return array;
  }, []);
}
