// @flow

import type { Tile, Factory, Scoring } from "./models";

// TYPES ////////////////////////////

export type UI = {| selectedFactory: ?Factory, selectedTile: ?Tile, currentScoringAct: ?Scoring |};

// FACTORIES ////////////////////////////

export function createResetUI() {
  return {
    selectedFactory: undefined,
    selectedTile: undefined,
    currentScoringAct: undefined
  };
}
