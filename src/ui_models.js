// @flow

import type { Tile, Factory } from "./models";

// TYPES ////////////////////////////

export type UI = {| selectedFactory: ?Factory, selectedTile: ?Tile |};

// FACTORIES ////////////////////////////

export function createResetUI() {
  return {
    selectedFactory: undefined,
    selectedTile: undefined
  };
}
