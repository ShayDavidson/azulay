// @flow

// types
import type { Game, Tile, Factory } from "./models";
import type { UI } from "./ui_models";
// action handlers
import { drawTileFromBagIntoFactories, moveToPlacementPhase, PHASES, areAllFactoriesFull } from "./models";
import { createResetUI } from "./ui_models";

/***********************************************************/

export type Action = {
  type: ActionName,
  payload?: {
    factory?: Factory,
    tile?: Tile
  }
};

export type ActionName = $Values<typeof ACTIONS>;

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

export function reducer(state: State, action: Action): State {
  const { game } = state;
  if (!validateAction(state, action)) {
    console.error("Invalid action", state, action);
    return state;
  }

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
      return state;
  }
}

/***********************************************************/

export function validateAction(state: State, action: Action): boolean {
  const { game } = state;
  switch (action.type) {
    case ACTIONS.moveToPlacementPhase:
      return game.phase == PHASES.refill;
    case ACTIONS.drawTileFromBagIntoFactories:
      return !areAllFactoriesFull(game) && game.phase == PHASES.refill;
    case ACTIONS.selectTileInFactory:
      return game.phase == PHASES.placement;
    default:
      return true;
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
