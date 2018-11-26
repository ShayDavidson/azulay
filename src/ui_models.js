// @flow

import type { Tile, Factory, Scoring } from "./models";

// TYPES ////////////////////////////

export type UI = {|
  selectedFactory: ?Factory,
  selectedTile: ?Tile,
  currentScoring: ?Scoring,
  animationSpeed: number
|};
