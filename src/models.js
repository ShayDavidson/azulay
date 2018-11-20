// @flow

import { createRNG } from "./random";

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
  scoring: "scoring",
  end: "end"
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

export type Wall = Array<Array<?Tile>>;

export type Staging = Array<StagingRow>;

export type Floor = Array<Tile>;

export type PlayerType = $Keys<typeof PLAYER_TYPE>;

export type TileKind = "first" | "colored";

export type Tile = {|
  kind: TileKind,
  color: ?ColorType
|};

export type Board = {|
  wall: Wall,
  staging: Staging,
  floor: Floor
|};

export type StagingRow = TilesArray;

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

export type TilesArray = Array<Tile>;

export type TilesColorCounter = Array<number>;

export type Factory = TilesArray;

export type Phase = $Keys<typeof PHASES>;

export type Scoring = {|
  player: Player,
  forTiles: Array<RowScoring>,
  floorScore: number,
  totalScore: number,
  finalWall: Wall
|};

export type RowScoring = {|
  wall: Wall,
  row: number,
  col: number,
  scoringTilesInCol: Array<[number, number]>,
  scoringTilesInRow: Array<[number, number]>,
  totalScoreAfterRow: number,
  totalScoreAfterCol: number,
  totalScoreAfter: number,
  rowScore: number,
  colScore: number,
  scoredEntireRow: boolean,
  scoredEntireCol: boolean,
  scoredEntireColor: boolean
|};

export type Game = {|
  players: Array<Player>,
  bag: TilesArray,
  box: TilesArray,
  factories: Array<TilesArray>,
  leftovers: Factory,
  turn: number,
  currentPlayer: number,
  nextPlayer: number,
  phase: Phase,
  randomProps: RandomProps
|};

// FACTORIES ////////////////////////////

export function createGame(players: number, seed: number): Game {
  const rng = createRNG(seed);
  return {
    players: [...Array(players)].map((_, index) => createPlayer(`Player ${index}`, "human")),
    bag: rng.shuffle(createBag()),
    box: [],
    factories: [...Array(FACTORIES_BY_PLAYERS[players])].map(() => []),
    leftovers: [createTile("first")],
    turn: 0,
    currentPlayer: rng.int(0, players - 1),
    nextPlayer: 0,
    phase: PHASES.refill,
    randomProps: { seed, counter: rng.getCounter() }
  };
}

export function createBag() {
  let tiles = [];
  for (let color = 0; color < COLORS; color++) {
    for (let count = 0; count < TILES_PER_COLOR; count++) {
      tiles.push(createTile("colored", color));
    }
  }
  return tiles;
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
    staging: [...new Array(COLORS)].map(() => {
      return [];
    }),
    floor: []
  };
}

export function createWall(): Wall {
  const wall = new Array(COLORS);
  for (let row = 0; row < COLORS; row++) {
    wall[row] = new Array(COLORS);
    for (let col = 0; col < COLORS; col++) {
      wall[row][col] = undefined;
    }
  }
  return wall;
}

export function createTile(kind: TileKind, color: ?ColorType): Tile {
  return { kind, color };
}

// ACTIONS ////////////////////////////

export function drawTileFromBagIntoFactories(game: Game): Game {
  const pickedTile = game.bag[0];
  if (pickedTile != undefined) {
    const bag = game.bag.slice(1, game.bag.length);
    let filledFactory = false;
    const factories = game.factories.map(factory => {
      if (isFactoryFull(factory) || filledFactory) {
        return factory;
      } else {
        filledFactory = true;
        return [...factory, pickedTile];
      }
    });

    return { ...game, bag, factories };
  } else {
    return game;
  }
}

export function moveToPlacementPhase(game: Game): Game {
  return { ...game, phase: PHASES.placement };
}

export function putTilesFromFactoryIntoFloor(game: Game, selectedFactory: Factory, selectedTile: Tile): Game {
  const currentPlayer = getCurrentPlayer(game);
  const { relevantTiles, remainingTiles, tookFirst } = takeTilesFromFactory(selectedFactory, selectedTile);
  const roomLeftInFloor = FLOOR_SLOTS.length - currentPlayer.board.floor.length;
  const [tilesToPutInFloor, tilesToPutInBox] = slice(relevantTiles, roomLeftInFloor);
  const floor = currentPlayer.board.floor.concat(tilesToPutInFloor);
  const factories = immutableCompareUpdate(game.factories, selectedFactory, []);
  const leftovers =
    game.leftovers == selectedFactory ? remainingTiles : game.leftovers.concat(remainingTiles).sort(tilesComparator);
  const box = game.box.concat(tilesToPutInBox);
  const newPlayer = { ...currentPlayer, board: { ...currentPlayer.board, floor } };
  const players = immutableCompareUpdate(game.players, currentPlayer, newPlayer);
  return {
    ...game,
    players,
    factories,
    box,
    nextPlayer: tookFirst ? game.currentPlayer : game.nextPlayer,
    leftovers
  };
}

export function putTilesFromFactoryIntoStagingRow(
  game: Game,
  stagingRowIndex: number,
  selectedFactory: Factory,
  selectedTile: Tile
): Game {
  const currentPlayer = getCurrentPlayer(game);
  let { relevantTiles, remainingTiles, tookFirst } = takeTilesFromFactory(selectedFactory, selectedTile);
  const stagingRow = currentPlayer.board.staging[stagingRowIndex];
  const roomLeftInRow = placementsForStagingRow(stagingRowIndex) - stagingRow.length;
  let firstTile;
  if (tookFirst) [relevantTiles, firstTile] = filterFirstTile(relevantTiles);
  let [tilesToPutInRow, tilesToPutInFloor] = slice(relevantTiles, roomLeftInRow);
  if (firstTile) tilesToPutInFloor = [...tilesToPutInFloor, ((firstTile: any): Tile)];
  const newStagingRow = stagingRow.concat(tilesToPutInRow);
  const staging = immutableCompareUpdate(currentPlayer.board.staging, stagingRow, newStagingRow);
  const roomLeftInFloor = FLOOR_SLOTS.length - currentPlayer.board.floor.length;
  const [tilesToActuallyPutInFloor, tilesToPutInBox] = slice(tilesToPutInFloor, roomLeftInFloor);
  const floor = currentPlayer.board.floor.concat(tilesToActuallyPutInFloor.sort(tilesComparator));
  const box = game.box.concat(tilesToPutInBox);
  const factories = immutableCompareUpdate(game.factories, selectedFactory, []);
  const leftovers =
    game.leftovers == selectedFactory ? remainingTiles : game.leftovers.concat(remainingTiles).sort(tilesComparator);
  const newPlayer = { ...currentPlayer, board: { ...currentPlayer.board, floor, staging } };
  const players = immutableCompareUpdate(game.players, currentPlayer, newPlayer);
  return {
    ...game,
    players,
    factories,
    box,
    nextPlayer: tookFirst ? game.currentPlayer : game.nextPlayer,
    leftovers
  };
}

export function moveToNextPlayer(game: Game): Game {
  return {
    ...game,
    currentPlayer: getNextPlayer(game)
  };
}

export function moveToScoringPhase(game: Game): Game {
  return { ...game, phase: PHASES.scoring };
}

export function scoreBoardForCurrentPlayer(game: Game, scoring: Scoring): Game {
  const currentPlayer = getCurrentPlayer(game);
  let tilesToDiscard = [];
  const staging = currentPlayer.board.staging.map((row, rowIndex) => {
    if (isStagingRowFull(row, rowIndex)) {
      tilesToDiscard = tilesToDiscard.concat(slice(row, 1)[1]);
      return [];
    } else {
      return row;
    }
  });

  const players = immutableCompareUpdate(game.players, currentPlayer, {
    ...currentPlayer,
    score: Math.max(0, currentPlayer.score + scoring.totalScore),
    board: {
      wall: scoring.finalWall,
      floor: [],
      staging
    }
  });
  const box = game.box.concat(tilesToDiscard);
  return { ...game, players, box };
}

export function moveToRefillPhase(game: Game): Game {
  return { ...game, phase: PHASES.refill };
}

export function shuffleBoxIntoBag(game: Game): Game {
  const rng = createRNG(game.randomProps.seed, game.randomProps.counter);
  const shuffledTiles = rng.shuffle(game.box);
  const randomProps = { ...game.randomProps, counter: rng.getCounter() };
  return { ...game, randomProps, box: [], bag: shuffledTiles };
}

export function moveToEndPhase(game: Game): Game {
  return { ...game, phase: PHASES.end };
}

// HELPERS ////////////////////////////

export function shouldGameBeOver(game: Game): boolean {
  return !!game.players.find(
    player => !!player.board.wall.find((_, index) => isWallRowComplete(player.board.wall, index))
  );
}

export function isWallRowComplete(wall: Wall, rowIndex: number): boolean {
  const row = wall[rowIndex];
  return row.filter(el => el).length == COLORS;
}

export function hasPlayersThatNeedsScoring(game: Game): boolean {
  return (
    game.players.find(player => {
      return player.board.floor.length > 0 || player.board.staging.find(isStagingRowFull) != null;
    }) != null
  );
}

export function getBoardScoring(player: Player): Scoring {
  const board = player.board;
  let forTiles = [];
  let totalScore = 0;
  let currentWall = player.board.wall;

  board.staging.forEach((stagingRow, stagingRowIndex) => {
    const placementColor = getStagingRowColor(stagingRow);
    if (isStagingRowFull(stagingRow, stagingRowIndex) && placementColor != undefined) {
      const tile = ((stagingRow[0]: any): Tile);
      currentWall = placeTileInWall(board.wall, stagingRowIndex, tile);
      const placementRow = stagingRowIndex;
      const placementCol = getWallPlacementCol(placementRow, placementColor);

      let rowScore = 0;
      let encounteredTileInRow = false;
      let scoringTilesInRow = [];
      for (let col = 0; col < COLORS; col++) {
        let inPlacement = col == placementCol;
        if (inPlacement) {
          encounteredTileInRow = true;
        }
        if (inPlacement || currentWall[placementRow][col]) {
          rowScore += 1;
          scoringTilesInRow.push([placementRow, col]);
        } else if (encounteredTileInRow) {
          break;
        } else {
          rowScore = 0;
        }
      }

      let colScore = 0;
      let encounteredTileInCol = false;
      let scoringTilesInCol = [];
      for (let row = 0; row < COLORS; row++) {
        let inPlacement = row == placementRow;
        if (inPlacement) {
          encounteredTileInRow = true;
        }
        if (inPlacement || currentWall[row][placementCol]) {
          colScore += 1;
          scoringTilesInRow.push([row, placementCol]);
        } else if (encounteredTileInCol) {
          break;
        } else {
          colScore = 0;
        }
      }

      let colorScore = 0;
      forTiles.push({
        wall: currentWall,
        row: placementRow,
        col: placementCol,
        scoringTilesInRow,
        totalScoreAfterRow: totalScore + rowScore,
        totalScoreAfterCol: totalScore + colScore,
        totalScoreAfter: totalScore + rowScore + colScore,
        scoringTilesInCol,
        rowScore,
        colScore,
        scoredEntireRow: scoringTilesInRow.length == COLORS,
        scoredEntireCol: scoringTilesInCol.length == COLORS,
        scoredEntireColor: countTilesOfColorInWall(currentWall, placementColor) == COLORS
      });
      totalScore += rowScore + colScore;
    }
  });
  const floorScore = getFloorScore(board.floor);
  totalScore += floorScore;
  return {
    player,
    forTiles,
    floorScore,
    totalScore,
    finalWall: currentWall
  };
}

function countTilesOfColorInWall(wall: Wall, color: ColorType): number {
  return wall.reduce(
    (count, _, rowIndex) => (wall[rowIndex][getWallPlacementCol(rowIndex, color)] ? count + 1 : count),
    0
  );
}

function getFloorScore(floor: Floor): number {
  return FLOOR_SLOTS.slice(0, floor.length).reduce((sum, a) => sum + a, 0);
}

function placeTileInWall(wall: Wall, fromStagingRowIndex: number, tile: Tile): Wall {
  if (tile.color != null) {
    const tileWallRow = fromStagingRowIndex;
    const tileWallCol = getWallPlacementCol(tileWallRow, tile.color);
    return wall.map(
      (wallRow, wallRowIndex) =>
        wallRowIndex == tileWallRow
          ? immutablePredicateUpdate(wallRow, (_, wallColIndex) => wallColIndex == tileWallCol, tile)
          : wallRow
    );
  } else {
    return wall;
  }
}

export function getNextPlayer(game: Game): number {
  return (game.currentPlayer + 1) % game.players.length;
}

export function immutableCompareUpdate<T>(array: Array<T>, value: T, newValue: T): Array<T> {
  return array.map(element => (element == value ? newValue : element));
}

export function immutablePredicateUpdate<T>(
  array: Array<T>,
  predicate: (value: T, index: number) => boolean,
  newValue: T
): Array<T> {
  return array.map((element, index) => (predicate(element, index) ? newValue : element));
}

export function tilesComparator(a: Tile, b: Tile): number {
  if (a.kind == "first") {
    return -1;
  } else if (b.kind == "first") {
    return 1;
  } else {
    return (a.color != undefined ? a.color : -1) - (b.color != undefined ? b.color : 0);
  }
}

export function filterFirstTile(array: TilesArray): [TilesArray, ?Tile] {
  return [array.filter(tile => tile.kind != "first"), array.find(tile => (tile.kind = "first"))];
}

export function slice(array: TilesArray, at: number): [TilesArray, TilesArray] {
  return [array.slice(0, at), array.slice(at, array.length)];
}

export function takeTilesFromFactory(selectedFactory: Factory, selectedTile: Tile) {
  const relevantTiles: TilesArray = selectedFactory
    .filter(tile => tile.color == selectedTile.color || tile.kind == "first")
    .sort(tilesComparator);
  const remainingTiles: TilesArray = selectedFactory.filter(
    tile => tile.color != selectedTile.color && tile.kind != "first"
  );

  const tookFirst = relevantTiles.find(tile => tile.kind == "first") != undefined;

  return { relevantTiles, remainingTiles, tookFirst };
}

export function getCurrentPlayer(game: Game): Player {
  return game.players[game.currentPlayer];
}

export function isStagingRowFull(stagingRow: ?StagingRow, index: number): boolean {
  if (stagingRow == undefined) {
    return false;
  } else {
    return stagingRow.length == index + 1;
  }
}

export function isFactoryFull(factory: Factory): boolean {
  return factory.length == FACTORY_MAX_TILES;
}

export function isFactoryEmpty(factory: Factory): boolean {
  return factory.length == 0;
}

export function areAllFactoriesFull(game: Game): boolean {
  return game.factories.find(factory => !isFactoryFull(factory)) == undefined;
}

export function areAllFactoriesEmpty(game: Game): boolean {
  return game.factories.find(factory => !isFactoryEmpty(factory)) == undefined && isFactoryEmpty(game.leftovers);
}

export function placementsForStagingRow(index: number): number {
  return index + 1;
}

export function canPlaceTilesInStagingRow(
  player: Player,
  stagingRowIndex: number,
  fromFactory: Factory,
  tile: Tile
): boolean {
  const stagingRow = player.board.staging[stagingRowIndex];
  if (tile.kind == "first") {
    return false;
  } else if (getStagingRowColor(stagingRow) != null && getStagingRowColor(stagingRow) != tile.color) {
    return false;
  } else if (tile.color != undefined && doesWallRowHasTileColor(player.board.wall, stagingRowIndex, tile.color)) {
    return false;
  } else if (isStagingRowFull(stagingRow, stagingRowIndex)) {
    return false;
  } else {
    return true;
  }
}

export function doesWallRowHasTileColor(wall: Wall, rowIndex: number, color: ColorType): boolean {
  const row = wall[rowIndex];
  return (
    row.find((hasTile, colIndex) => {
      return hasTile && getWallPlacementColor(rowIndex, colIndex) == color;
    }) != undefined
  );
}

export function getWallPlacementCol(row: number, color: ColorType): number {
  return (row + color) % COLORS;
}

export function getWallPlacementColor(row: number, col: number): ColorType {
  return (col + row) % COLORS;
}

export function getTilesColorCounter(tiles: TilesArray): TilesColorCounter {
  return tiles.reduce(
    (counter, tile) => {
      if (tile.color != undefined) {
        counter[tile.color] += 1;
      }
      return counter;
    },
    [0, 0, 0, 0, 0]
  );
}

export function getStagingRowColor(row: StagingRow): ?ColorType {
  return row[0] ? row[0].color : undefined;
}
