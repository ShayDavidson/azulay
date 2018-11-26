// @flow

import type { Tile, Factory, Scoring } from "./models";

// TYPES ////////////////////////////

export type ScoringPhase = {|
  type: "row" | "floor",
  index?: number
|};

export type UI = {|
  selectedFactory: ?Factory,
  selectedTile: ?Tile,
  currentScoring: ?Scoring,
  animationSpeed: number
|};
