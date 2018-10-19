// @flow

// CONSTS ////////////////////////////

export const COLORS = 5;
export const FLOOR_SLOTS = [-1, -1, -2, -2, -2, -3, -3];
export const FACTORIES_BY_PLAYERS = [0, 0, 5, 7, 9];
export const TILES_PER_COLOR = 20;
export const ROW_BONUS = 2;
export const COL_BONUS = 7;
export const COLOR_BONUS = 10;
export const PHASES = {
  refill: "refill",
  placement: "placement",
  scoring: "scoring"
};

// TYPES ////////////////////////////

export type RandomProps = {|
  seed: number,
  counter: number
|};

export type ColorType = number;

export type WallPlacement = boolean;

export type Wall = Array<Array<WallPlacement>>;

export type Board = {|
  wall: Wall,
  staging: Array<StagingRow>,
  floor: Array<?ColorType>
|};

export type StagingRow = {|
  color: ColorType,
  count: number
|};

export type Player = {|
  score: number,
  board: Board
|};

export type ColorBundle = {|
  color: ColorType,
  count: number
|};

export type TilesColorCounter = Array<number>;

export type Phase = $Keys<typeof PHASES>;

export type Game = {|
  players: Array<Player>,
  bag: TilesColorCounter,
  box: TilesColorCounter,
  factories: Array<TilesColorCounter>,
  turn: number,
  currentPlayer: number,
  phase: Phase,
  randomProps: RandomProps
|};

// FACTORIES ////////////////////////////

export function createGame(players: number, seed: number): Game {
  return {
    players: new Array(players).map(createPlayer),
    bag: createColorCountArray(TILES_PER_COLOR),
    box: createColorCountArray(0),
    factories: new Array(FACTORIES_BY_PLAYERS[players]).map(() => createColorCountArray(0)),
    turn: 0,
    currentPlayer: 0,
    phase: PHASES.refill,
    randomProps: { seed, counter: 0 }
  };
}

export function createColorCountArray(count: number): TilesColorCounter {
  return new Array(COLORS).fill(count);
}

export function createPlayer(): Player {
  return {
    score: 0,
    board: createBoard()
  };
}

export function createBoard(): Board {
  return {
    wall: createWall(),
    staging: new Array(COLORS),
    floor: new Array(FLOOR_SLOTS.length)
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

// INTERNAL ACTIONS ////////////////////////////

function placeTileInWall(wall: Wall, fromStagingRowIndex: number, tileColor: ColorType): Wall {
  let tileWallRow = fromStagingRowIndex;
  let tileWallCol = getWallPlacementCol(tileWallRow, tileColor);
  return wall.map((wallRow, wallRowIndex) => {
    if (wallRowIndex == tileWallRow) {
      return wallRow.slice.map((_, wallColIndex) => wallColIndex == tileWallCol);
    } else {
      return wallRow.slice();
    }
  });
}

// CALCULATIONS ////////////////////////////

export function calculateBoardAddedScore(board: Board): number {
  return board.staging.reduce((score, stagingRow, stagingRowIndex) => {
    if (isStagingRowFull(stagingRow, stagingRowIndex)) {
      let placementColor = stagingRow.color;
      let newWall = placeTileInWall(board.wall, stagingRowIndex, placementColor);
      let placementRow = stagingRowIndex;
      let placementCol = getWallPlacementCol(placementRow, placementColor);
      return score + calculateTilePlacementScore(newWall, placementRow, placementCol);
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

// HELPERS ////////////////////////////

export function isStagingRowFull(stagingRow: ?StagingRow, index: number): boolean {
  if (stagingRow == undefined) {
    return false;
  } else {
    return stagingRow.count == index + 1;
  }
}

export function getWallPlacementCol(row: number, color: ColorType): number {
  return (row + color) % COLORS;
}

export function getWallPlacementColor(row: number, col: number): ColorType {
  return (col + row) % COLORS;
}
