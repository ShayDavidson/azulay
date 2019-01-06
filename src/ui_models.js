// @flow

import type { Tile, Factory, Scoring, TilesArray } from "./models";

// TYPES ////////////////////////////

export type UI = {|
  selectedFactory: ?Factory,
  selectedTile: ?Tile,
  currentScoring: ?Scoring,
  animationSpeed: number
|};

export type Highlights = {|
  type: "row" | "floor" | "prepare",
  row: number,
  col: number,
  bonus: boolean,
  tiles?: TilesArray
|};
