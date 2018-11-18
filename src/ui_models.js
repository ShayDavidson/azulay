// @flow

import type { Tile, Factory, RowScoring } from "./models";

// TYPES ////////////////////////////

export type UI = {|
  selectedFactory: ?Factory,
  selectedTile: ?Tile,
  currentRowScoring: ?RowScoring
|};

// FACTORIES ////////////////////////////

export function createResetUI() {
  return {
    selectedFactory: undefined,
    selectedTile: undefined,
    currentRowScoring: undefined
  };
}
