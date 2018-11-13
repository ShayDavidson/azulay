// @flow

// types
import type { Game, Tile, Factory, Floor } from "./models";
import type { UI } from "./ui_models";
// action handlers
import {
  drawTileFromBagIntoFactories,
  moveToPlacementPhase,
  PHASES,
  FLOOR_SLOTS,
  areAllFactoriesFull,
  putTilesFromFactoryIntoFloor
} from "./models";
import { createResetUI } from "./ui_models";

/***********************************************************/

export type Action = {
  type: ActionName,
  payload?: {
    factory?: Factory,
    tile?: Tile,
    floor?: Floor
  }
};

export type ActionName = $Values<typeof ACTIONS>;

export type State = {
  game: Game,
  ui: UI
};

/***********************************************************/

export const ACTIONS = {
  moveToPlacementPhase: "moveToPlacementPhase",
  drawTileFromBagIntoFactories: "drawTileFromBagIntoFactories",
  selectTileInFactory: "selectTileInFactory",
  putTilesFromFactoryIntoFloor: "putTilesFromFactoryIntoFloor",
  putTilesFromFactoryIntoStagingRow: "putTilesFromFactoryIntoStagingRow"
};

/***********************************************************/

export function reduce(state: State, action: Action): State {
  const { game, ui } = state;
  const { selectedFactory, selectedTile } = ui;

  switch (action.type) {
    case ACTIONS.moveToPlacementPhase: {
      return { ...state, game: moveToPlacementPhase(game) };
    }

    case ACTIONS.drawTileFromBagIntoFactories: {
      return { ...state, game: drawTileFromBagIntoFactories(game) };
    }

    case ACTIONS.selectTileInFactory: {
      return {
        ...state,
        ui: {
          selectedFactory: isDeselect(action, ui) ? undefined : action.payload && action.payload.factory,
          selectedTile: isDeselect(action, ui) ? undefined : action.payload && action.payload.tile
        }
      };
    }

    case ACTIONS.putTilesFromFactoryIntoFloor: {
      if (selectedFactory != undefined && selectedTile != undefined) {
        return {
          ...state,
          game: putTilesFromFactoryIntoFloor(game, selectedFactory, selectedTile),
          ui: createResetUI()
        };
      } else {
        return state;
      }
    }

    case ACTIONS.putTilesFromFactoryIntoStagingRow: {
      return state;
    }

    default:
      return state;
  }
}

/***********************************************************/

export function validate(state: State, action: Action): ?Error {
  const { game, ui } = state;
  switch (action.type) {
    case ACTIONS.selectTileInFactory: {
      return game.phase == PHASES.placement ? undefined : new Error("can't interact while refilling tiles");
    }

    case ACTIONS.moveToPlacementPhase: {
      return game.phase == PHASES.refill ? undefined : new Error("not in right phase");
    }

    case ACTIONS.drawTileFromBagIntoFactories: {
      if (areAllFactoriesFull(game)) {
        return new Error("factories are full");
      } else if (game.phase != PHASES.refill) {
        return new Error("can't refill factory in this phase");
      } else {
        return undefined;
      }
    }

    case ACTIONS.putTilesFromFactoryIntoFloor: {
      if (ui.selectedFactory == undefined || ui.selectedTile == undefined) {
        return new Error("no selected tile in factory");
      } else if (game.phase != PHASES.placement) {
        return new Error("can't put tile in board in this phase");
      } else if (action.payload && action.payload.floor != game.players[game.currentPlayer].board.floor) {
        return new Error("wrong player's floor");
      } else {
        return undefined;
      }
    }

    default:
      return undefined;
  }
}

/***********************************************************/

export function isDeselect(action: Action, ui: UI): boolean {
  return action.payload &&
    action.payload.factory &&
    action.payload.factory == ui.selectedFactory &&
    action.payload.tile &&
    action.payload.tile == ui.selectedTile
    ? true
    : false;
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

export function getPutTilesFromFactoryIntoFloorAction(floor: Floor): Action {
  return {
    type: ACTIONS.putTilesFromFactoryIntoFloor,
    payload: { floor }
  };
}

export function getPutTilesFromFactoryIntoStagingRowAction(stagingRowIndex: number): Action {
  return {
    type: ACTIONS.putTilesFromFactoryIntoStagingRow,
    payload: {
      stagingRowIndex
    }
  };
}
