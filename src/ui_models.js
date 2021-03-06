// @flow

import type { Tile, Factory, Scoring, TilesArray } from "./models";

// TYPES ////////////////////////////

export type UI = {|
  selectedFactory?: ?Factory,
  selectedTile?: ?Tile
|};

export type Presentation = {|
  currentScoring: ?Scoring
|};

export type Config = {|
  animationSpeed: number
|};

export type Highlights = {|
  type: "row" | "floor" | "prepare",
  row?: ?number,
  col?: ?number,
  bonus: boolean,
  floater?: ?string,
  tiles?: ?TilesArray
|};
