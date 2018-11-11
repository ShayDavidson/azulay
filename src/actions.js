// @flow

// types
import type { Game, Tile, Factory } from "./models";
import type { UI } from "./ui_models";
// action handlers
import { drawTileFromBagIntoFactories, moveToPlacementPhase, PHASES, FLOOR_SLOTS, areAllFactoriesFull } from "./models";
// import { createResetUI } from "./ui_models";

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
        const currentPlayer = game.players[game.currentPlayer];
        const relevantTiles = selectedFactory
          .filter(tile => tile.color == selectedTile.color || tile.kind == "first")
          .sort((a, b) => (a.kind == "first" ? -1 : b.kind == "first" ? 1 : 0));
        const remainingTiles = selectedFactory.filter(tile => tile.color != selectedTile.color && tile.kind != "first");
        const roomLeftInFloor = FLOOR_SLOTS.length - relevantTiles.length;
        const floor = currentPlayer.board.floor.concat(relevantTiles.slice(0, roomLeftInFloor));
        const box = game.bag.concat(relevantTiles.slice(roomLeftInFloor, remainingTiles.length - roomLeftInFloor));
        const newPlayer = { ...currentPlayer, board: { ...currentPlayer.board, floor } };
        const players = game.players.map(player => (player == currentPlayer ? newPlayer : player));
        return { ...state, game: { ...state.game, players, box } };
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
  const { game } = state;
  switch (action.type) {
    case ACTIONS.moveToPlacementPhase:
      return game.phase == PHASES.refill ? undefined : new Error("not in right phase");

    case ACTIONS.drawTileFromBagIntoFactories:
      return !areAllFactoriesFull(game) && game.phase == PHASES.refill ? undefined : new Error("factories are full");

    case ACTIONS.putTilesFromFactoryIntoStagingRow:
      return undefined;

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

export function getPutTilesFromFactoryIntoFloorAction(): Action {
  return {
    type: ACTIONS.putTilesFromFactoryIntoFloor
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
