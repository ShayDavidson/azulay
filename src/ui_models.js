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
  currentScoring: ?Scoring
|};

// FACTORIES ////////////////////////////

export function createResetUI() {
  return {
    selectedFactory: undefined,
    selectedTile: undefined,
    currentScoring: undefined
  };
}
