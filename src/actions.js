// @flow

import type { Tile, Factory } from "./models";

/***********************************************************/

type Action = {
  type: $Values<typeof ACTIONS>,
  payload?: {}
};

/***********************************************************/

export const ACTIONS = {
  drawTileFromBagIntoFactories: "GAME/drawTileFromBagIntoFactories",
  selectTileInFactory: "UI/selectTileInFactory"
};

/***********************************************************/

export function selectTileInFactory(factory: Factory, tile: Tile): Action {
  return {
    type: ACTIONS.selectTileInFactory,
    payload: {
      factory,
      tile
    }
  };
}

export function drawTileFromBagIntoFactories(): Action {
  return {
    type: ACTIONS.drawTileFromBagIntoFactories
  };
}
