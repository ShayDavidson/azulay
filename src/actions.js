// @flow

import Promise from "bluebird";

// types
import type { Game, Tile, Factory, Floor, Scoring } from "./models";
import type { UI } from "./ui_models";

// action handlers
import {
  PHASES,
  drawTileFromBagIntoFactories,
  moveToPlacementPhase,
  areAllFactoriesFull,
  putTilesFromFactoryIntoFloor,
  putTilesFromFactoryIntoStagingRow,
  moveToNextPlayer,
  moveToScoringPhase,
  moveToRefillPhase,
  shuffleBoxIntoBag,
  moveToEndPhase,
  shouldGameBeOver,
  getCurrentPlayer,
  scoreBoardForCurrentPlayer,
  areAllFactoriesEmpty,
  canPlaceTilesInStagingRow,
  getBoardScoring
} from "./models";
import { createResetUI } from "./ui_models";
// helpers
import { play, playRandom, TILES, CLICK, SHUFFLE } from "./sfx";

/***********************************************************/

export type Action = {
  type: ActionName,
  payload: {
    factory?: Factory,
    tile?: Tile,
    floor?: Floor,
    stagingRowIndex?: number,
    scoring?: Scoring,
    scoringIndex?: number
  }
};

export type ActionName = $Values<typeof ACTIONS>;
export type ActionDispatcher = (action: Action) => Promise<any>;
export type ActionFallbackDispatcher = (actionPromise: ActionDispatcherPromise) => Promise<any>;
export type ActionDispatcherPromise = (
  dispatch: ActionDispatcher,
  fallbackDispatch: ActionFallbackDispatcher,
  state: State
) => Promise<any>;

export type ValidationError = Error & {
  action?: Action,
  state?: State,
  fallbackAction?: ActionDispatcherPromise
};

export type State = {
  game: Game,
  ui: UI
};

/***********************************************************/

export const ACTIONS = {
  drawTileFromBagIntoFactories: "drawTileFromBagIntoFactories",
  moveToPlacementPhase: "moveToPlacementPhase",
  selectTileInFactory: "selectTileInFactory",
  putTilesFromFactoryIntoFloor: "putTilesFromFactoryIntoFloor",
  putTilesFromFactoryIntoStagingRow: "putTilesFromFactoryIntoStagingRow",
  moveToNextPlayerPlacement: "moveToNextPlayerPlacement",
  moveToScoringPhase: "moveToScoringPhase",
  moveToNextPlayerScoring: "moveToNextPlayerScoring",
  scoreBoardForCurrentPlayer: "scoreBoardForCurrentPlayer",
  moveToRefillPhase: "moveToRefillPhase",
  shuffleBoxIntoBag: "shuffleBoxIntoBag",
  moveToEndPhase: "moveToEndPhase"
};

/***********************************************************/

export function reduce(state: State, action: Action): State {
  const { game, ui } = state;
  const { selectedFactory, selectedTile } = ui;

  switch (action.type) {
    case ACTIONS.drawTileFromBagIntoFactories: {
      return { ...state, game: drawTileFromBagIntoFactories(game) };
    }

    case ACTIONS.moveToPlacementPhase: {
      return { ...state, game: moveToPlacementPhase(game) };
    }

    case ACTIONS.selectTileInFactory: {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedFactory: isDeselect(action, ui) ? undefined : action.payload.factory,
          selectedTile: isDeselect(action, ui) ? undefined : action.payload.tile
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
      if (selectedFactory != undefined && selectedTile != undefined && action.payload.stagingRowIndex != undefined) {
        return {
          ...state,
          game: putTilesFromFactoryIntoStagingRow(game, action.payload.stagingRowIndex, selectedFactory, selectedTile),
          ui: createResetUI()
        };
      } else {
        return state;
      }
    }

    case ACTIONS.moveToNextPlayerPlacement: {
      return { ...state, game: moveToNextPlayer(game) };
    }

    case ACTIONS.moveToScoringPhase: {
      return { ...state, game: moveToScoringPhase(game) };
    }

    case ACTIONS.moveToNextPlayerScoring: {
      return { ...state, game: moveToNextPlayer(game) };
    }

    case ACTIONS.scoreBoardForCurrentPlayer: {
      const scoring = getBoardScoring(getCurrentPlayer(game));
      return {
        ...state,
        game: scoreBoardForCurrentPlayer(game, scoring),
        ui: { ...state.ui, currentScoring: scoring }
      };
    }

    case ACTIONS.moveToRefillPhase: {
      return { ...state, game: moveToRefillPhase(game) };
    }

    case ACTIONS.shuffleBoxIntoBag: {
      return { ...state, game: shuffleBoxIntoBag(game) };
    }

    case ACTIONS.moveToEndPhase: {
      return { ...state, game: moveToEndPhase(game) };
    }

    default:
      return state;
  }
}

/***********************************************************/

export function validate(state: State, action: Action): ?ValidationError {
  const { game, ui } = state;
  const { type, payload } = action;
  let error: ?ValidationError;
  let fallbackAction: ?ActionDispatcherPromise;

  switch (type) {
    case ACTIONS.drawTileFromBagIntoFactories: {
      if (areAllFactoriesFull(game)) {
        error = new Error("factories are full");
        fallbackAction = getMoveToPlacementPhaseAction();
      } else if (game.phase != PHASES.refill) {
        error = new Error("can't refill factory in this phase");
      } else if (game.bag.length == 0) {
        error = new Error("bag is empty");
        if (game.box.length == 0) {
          fallbackAction = getMoveToPlacementPhaseAction();
        } else {
          fallbackAction = getShuffleBoxIntoBagAction();
        }
      }
      break;
    }

    case ACTIONS.moveToPlacementPhase: {
      if (game.phase != PHASES.refill) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.selectTileInFactory: {
      if (game.phase != PHASES.placement) {
        error = new Error("can't interact while refilling tiles");
      }
      break;
    }

    case ACTIONS.putTilesFromFactoryIntoFloor: {
      const { selectedFactory, selectedTile } = ui;
      if (selectedFactory == null || selectedTile == null) {
        error = new Error("no selected tile in factory");
      } else if (game.phase != PHASES.placement) {
        error = new Error("can't put tile in board in this phase");
      } else if (payload.floor != game.players[game.currentPlayer].board.floor) {
        error = new Error("wrong player's floor");
      }
      break;
    }

    case ACTIONS.putTilesFromFactoryIntoStagingRow: {
      const { selectedFactory, selectedTile } = ui;
      const { stagingRowIndex } = payload;
      if (selectedFactory == null || selectedTile == null) {
        error = new Error("no selected tile in factory");
      } else if (stagingRowIndex == null) {
        error = new Error("no selected staging row");
      } else if (game.phase != PHASES.placement) {
        error = new Error("can't put tile in board in this phase");
      } else if (selectedTile.kind == "first") {
        error = new Error("can't put first tile in staging");
      } else if (!canPlaceTilesInStagingRow(getCurrentPlayer(game), stagingRowIndex, selectedFactory, selectedTile)) {
        error = new Error("staging area cannot contain tile");
      }
      break;
    }

    case ACTIONS.moveToNextPlayerPlacement: {
      if (game.phase != PHASES.placement) {
        error = new Error("not in right phase");
      } else if (areAllFactoriesEmpty(game)) {
        error = new Error("factories are empty");
        fallbackAction = getMoveToScoringPhaseAction();
      }
      break;
    }

    case ACTIONS.moveToScoringPhase: {
      if (game.phase != PHASES.placement) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.moveToNextPlayerScoring: {
      // TODO
      // if (game.phase != PHASES.scoring) {
      //   error = new Error("not in right phase");
      // } else if (true) {
      //   error = new Error("shown scoring for all players");
      //   if (shouldGameBeOver(game)) {
      //     fallbackAction = getMoveToEndPhaseAction();
      //   } else {
      //     fallbackAction = getMoveToRefillPhaseAction();
      //   }
      // }
      break;
    }

    case ACTIONS.scoreBoardForCurrentPlayer: {
      // TODO
      // if (game.phase != PHASES.scoring) {
      //   error = new Error("not in right phase");
      // } else if (true) {
      //   error = new Error("shown scoring for all players");
      //   if (shouldGameBeOver(game)) {
      //     fallbackAction = getMoveToEndPhaseAction();
      //   } else {
      //     fallbackAction = getMoveToRefillPhaseAction();
      //   }
      // }
      break;
    }

    case ACTIONS.moveToRefillPhase: {
      if (game.phase != PHASES.scoring) {
        error = new Error("not in right phase");
      }
      break;
    }

    case ACTIONS.shuffleBoxIntoBag: {
      if (game.phase != PHASES.refill) {
        error = new Error("not in right phase");
      } else if (game.bag.length != 0) {
        error = new Error("bag is not emtpy");
      }
      break;
    }

    case ACTIONS.moveToEndPhase: {
      if (game.phase != PHASES.scoring) {
        error = new Error("not in right phase");
      } else if (!shouldGameBeOver(game)) {
        error = new Error("game should not be over yet");
      }
      break;
    }
  }

  if (error) {
    error.state = state;
    error.action = action;
    (error: any).fallbackAction = fallbackAction; // casting due to weird flowtype issue
  }

  return error;
}

/***********************************************************/

export function isDeselect(action: Action, ui: UI): boolean {
  return action.payload.factory &&
    action.payload.factory == ui.selectedFactory &&
    action.payload.tile &&
    action.payload.tile == ui.selectedTile
    ? true
    : false;
}

/***********************************************************/

export function getDrawTileFromBagIntoFactoriesAction(): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.drawTileFromBagIntoFactories,
      payload: {}
    })
      .then(() => playRandom(TILES))
      .delay(75)
      .then(() => followupDispatch(getDrawTileFromBagIntoFactoriesAction()));
  };
}

export function getMoveToPlacementPhaseAction(): ActionDispatcherPromise {
  return dispatch => {
    return dispatch({
      type: ACTIONS.moveToPlacementPhase,
      payload: {}
    });
  };
}

export function getSelectTileInFactoryAction(factory: Factory, tile: Tile): ActionDispatcherPromise {
  return dispatch => {
    return dispatch({
      type: ACTIONS.selectTileInFactory,
      payload: {
        factory,
        tile
      }
    }).then(() => play(CLICK));
  };
}

export function getPutTilesFromFactoryIntoFloorAction(floor: Floor): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.putTilesFromFactoryIntoFloor,
      payload: { floor }
    })
      .then(() => play(CLICK))
      .then(() => followupDispatch(getMoveToNextPlayerPlacementAction()));
  };
}

export function getPutTilesFromFactoryIntoStagingRowAction(stagingRowIndex: number): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.putTilesFromFactoryIntoStagingRow,
      payload: {
        stagingRowIndex
      }
    })
      .then(() => play(CLICK))
      .then(() => followupDispatch(getMoveToNextPlayerPlacementAction()));
  };
}

export function getMoveToNextPlayerPlacementAction(): ActionDispatcherPromise {
  return dispatch => {
    return dispatch({
      type: ACTIONS.moveToNextPlayerPlacement,
      payload: {}
    });
  };
}

export function getMoveToScoringPhaseAction(): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.moveToScoringPhase,
      payload: {}
    })
      .delay(500)
      .then(() => followupDispatch(getMoveToNextPlayerScoringAction()));
  };
}

export function getMoveToNextPlayerScoringAction(): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.moveToNextPlayerScoring,
      payload: {}
    })
      .then(() => followupDispatch(getScoreBoardForCurrentPlayerAction()))
      .delay(500);
  };
}

export function getScoreBoardForCurrentPlayerAction(): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.scoreBoardForCurrentPlayer,
      payload: {}
    })
      .then(() => followupDispatch(getMoveToNextPlayerScoringAction()))
      .delay(500);
  };
}

export function getMoveToRefillPhaseAction(): ActionDispatcherPromise {
  return dispatch => {
    return dispatch({
      type: ACTIONS.moveToRefillPhase,
      payload: {}
    }).delay(500);
  };
}

export function getShuffleBoxIntoBagAction(): ActionDispatcherPromise {
  return (dispatch, followupDispatch) => {
    return dispatch({
      type: ACTIONS.shuffleBoxIntoBag,
      payload: {}
    })
      .then(() => play(SHUFFLE))
      .delay(500)
      .then(() => followupDispatch(getDrawTileFromBagIntoFactoriesAction()));
  };
}

export function getMoveToEndPhaseAction(): ActionDispatcherPromise {
  return dispatch => {
    return dispatch({
      type: ACTIONS.moveToEndPhase,
      payload: {}
    });
  };
}
