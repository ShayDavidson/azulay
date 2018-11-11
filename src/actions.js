// @flow

// types
import type { Game, Tile, Factory } from "./models";
import type { UI } from "./ui_models";
// action handlers
import { drawTileFromBagIntoFactories, moveToPlacementPhase } from "./models";
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
  moveToPlacementPhase: "GAME/moveToPlacementPhase",
  drawTileFromBagIntoFactories: "GAME/drawTileFromBagIntoFactories",
  selectTileInFactory: "UI/selectTileInFactory"
};

/***********************************************************/

export function reducer({ game, ui }: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.moveToPlacementPhase:
      return { game: moveToPlacementPhase(game), ui: createResetUI() };
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

export function getSelectTileInFactoryAction(factory: Factory, tile: Tile): Action {
  return {
    type: ACTIONS.selectTileInFactory,
    payload: {
      factory,
      tile
    }
  };
}

export function getMoveToPlacementPhaseAction(): Action {
  return {
    type: ACTIONS.moveToPlacementPhase
  };
}

export function getDrawTileFromBagIntoFactoriesAction(): Action {
  return {
    type: ACTIONS.drawTileFromBagIntoFactories
  };
}
