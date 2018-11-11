// @flow

// types
import type { Game, Tile, Factory } from "./models";
import type { UI } from "./ui_models";
// action handlers
import { drawTileFromBagIntoFactories } from "./models";
import { createResetUI } from "./ui_models";

/***********************************************************/

export type Action = {
  type: $Values<typeof ACTIONS>,
  payload?: {
    factory?: Factory,
    tile?: Tile
  }
};

export type State = {
  game: Game,
  ui: UI
};

/***********************************************************/

export const ACTIONS = {
  drawTileFromBagIntoFactories: "GAME/drawTileFromBagIntoFactories",
  selectTileInFactory: "UI/selectTileInFactory"
};

/***********************************************************/

export function reducer({ game, ui }: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.drawTileFromBagIntoFactories:
      return { game: drawTileFromBagIntoFactories(game), ui: createResetUI() };
    case ACTIONS.selectTileInFactory:
      return {
        game,
        ui: {
          selectedFactory: action.payload && action.payload.factory,
          selectedTile: action.payload && action.payload.tile
        }
      };
    default:
      return { game, ui };
  }
}

/***********************************************************/

export function selectTileInFactoryAction(factory: Factory, tile: Tile): Action {
  return {
    type: ACTIONS.selectTileInFactory,
    payload: {
      factory,
      tile
    }
  };
}

export function drawTileFromBagIntoFactoriesAction(): Action {
  return {
    type: ACTIONS.drawTileFromBagIntoFactories
  };
}
